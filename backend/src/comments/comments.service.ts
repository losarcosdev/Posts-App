import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { Post } from '../posts/entities';
import { Comment } from './entities';
import { User } from '../user/entities';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  /**
   * Creates a new comment on a post and saves it to the database.
   * @param createCommentDto The DTO containing the content of the comment to be created.
   * @param postId The ID of the post on which the comment will be created.
   * @param user The user creating the comment.
   * @returns The newly created comment.
   * @throws NotFoundException if the post specified by `postId` cannot be found.
   */
  async addComment(
    createCommentDto: CreateCommentDto,
    postId: string,
    user: User,
  ) {
    const { content } = createCommentDto;

    // Find the post in the database with the provided postId.
    const post = await this.postRepository.findOneBy({ id: postId });

    // Throw a NotFoundException if the post is not found.
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Create a new Comment object and set its fields based on the input data.
    const newComment = await this.commentRepository.create({
      content,
      post,
      user,
      responses: [],
    });

    // Save the new comment to the database.
    await this.commentRepository.save(newComment);

    // Remove unnecessary fields from the new comment object before returning it.
    delete newComment.post;
    delete newComment.parentId;
    delete newComment.user.roles;
    delete newComment.user.comments;
    delete newComment.user.likes;
    delete newComment.user.resetPasswordToken;
    delete newComment.user.email;

    // Return the newly created comment object.
    return newComment;
  }

  /**
   * Adds a reply to a parent comment.
   * @param createCommentDto The DTO containing the reply content.
   * @param parentCommentID The ID of the parent comment.
   * @param user The user adding the reply.
   * @returns The newly created reply.
   * @throws NotFoundException If the parent comment is not found.
   */
  async addReply(
    createCommentDto: CreateCommentDto,
    parentCommentID: string,
    user: User,
  ): Promise<Comment> {
    const { content } = createCommentDto;

    // Find the parent comment in the database and look for a comment with the specified ID
    const parent = await this.commentRepository.findOneBy({
      id: parentCommentID,
    });

    // If the parent comment is not found, throw an exception
    if (!parent) {
      throw new NotFoundException('Comment not found');
    }

    // Create a new comment with the specified content and user
    const reply = this.commentRepository.create({ content, user });

    // Set the parent of the new comment to the parent comment being replied to
    reply.parent = parent;

    // Set the post of the new comment to the post of the parent comment
    reply.post = parent.post;

    // Save the new comment to the database
    await this.commentRepository.save(reply);

    // Return the new comment
    return reply;
  }

  /**
    Returns a post with all of its comments and their responses.
    @param id The ID of the post to retrieve.
    @returns A post with all of its comments and their responses also returns the total amount of comments.
    @throws NotFoundException if the post with the specified ID does not exist.
    */
  async getAllPostComments(id: string): Promise<Comment[]> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .where({ id })
      .getOne();

    if (!post) {
      throw new NotFoundException(`Post with ID: ${id} not found`);
    }

    const commentsWithResponses = await this.getCommentsWithResponses(
      post.comments,
    );

    post.comments = commentsWithResponses;

    return post.comments;
  }

  /**
    Recursively retrieves all responses for each comment in the given array.
    @param comments The array of comments to retrieve responses for.
    @returns The array of comments with their responses.
    */
  private async getCommentsWithResponses(
    comments: Comment[],
  ): Promise<Comment[]> {
    // Create an empty array to store the comments with their responses.
    const commentsWithResponses = [];

    // Iterate through each comment in the input array.
    for (const comment of comments) {
      // Fetch the comment and its associated user and response data from the database using the TypeORM library's createQueryBuilder method.
      // Use several leftJoint statements to specify the relationships between the entities.
      const commentWithResponses = await this.commentRepository
        .createQueryBuilder('comment')
        .select(['comment.id', 'comment.content', 'comment.date'])
        .addSelect([
          'commentUser.username',
          'commentUser.avatar',
          'commentUser.firstName',
          'commentUser.lastName',
          'commentUser.id',
        ])
        .leftJoin('comment.user', 'commentUser')
        .leftJoinAndSelect('comment.responses', 'response')
        .leftJoin('response.user', 'responseUser')
        .addSelect([
          'responseUser.username',
          'responseUser.avatar',
          'responseUser.firstName',
          'responseUser.lastName',
          'responseUser.id',
        ])
        .where({ id: comment.id })
        .getOne();

      // If the fetched comment has any responses, recursively call this function passing the array of responses as input to retrieve the responses for each comment.
      if (commentWithResponses.responses.length > 0) {
        commentWithResponses.responses = await this.getCommentsWithResponses(
          commentWithResponses.responses,
        );
      }

      // Add the fetched comment and its responses to the commentsWithResponses array.
      commentsWithResponses.push(commentWithResponses);
    }

    // Return the array of comments with their responses.
    return commentsWithResponses;
  }

  async getTotalComments(postId: string): Promise<number> {
    // Get all top-level comments for the post
    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['responses'],
    });

    // Recursive function to count comments and replies
    const countComments = (comment: Comment) => {
      let count = 1; // Start with 1 to count the comment itself

      if (comment.responses && comment.responses.length > 0) {
        // If the comment has replies, add the count of each reply
        for (const reply of comment.responses) {
          count += countComments(reply);
        }
      }

      return count;
    };

    let total = 0;

    // Loop through each top-level comment and add its count to the total
    for (const comment of comments) {
      total += countComments(comment);
    }

    return total;
  }

  /**
    Finds a comment by its ID and returns it.
    @param id - the ID of the comment to find.
    @throw a NotFoundException if the comment is not found.
    @returns the comment found.
    */
  async findOne(id: string) {
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  /**
    Updates the content of a comment with the provided ID.
    @throw a NotFoundException if the comment is not found.
    @param id - the ID of the comment to update.
    @param updateCommentDto - an object containing the updated content of the comment.
    @returns the updated comment.
    */
  async update(id: string, updateCommentDto: UpdateCommentDto, user: User) {
    const { content } = updateCommentDto;

    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .where({ id })
      .getOne();

    // If the comment does not exist, throw a NotFoundException
    if (!comment) {
      throw new NotFoundException(`Comment with id: ${id} not found`);
    }

    if (user.id !== comment.user.id) {
      throw new UnauthorizedException(
        'You don`t have permission to update this comment',
      );
    }

    // Create a new object with the updated comment content
    comment.content = content;

    // Save the updated comment to the database
    await this.commentRepository.save(comment);

    // Return the updated comment
    return comment;
  }

  /**
    Finds a comment by its ID and removes it.
    @param id - the ID of the comment to remove.
    @throw a NotFoundException if the comment is not found.
    @returns the comment removed.
    */
  async remove(id: string, user: User) {
    // Find the comment by its ID in the database
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .where({ id })
      .getOne();

    if (user.id !== comment.user.id) {
      throw new UnauthorizedException(
        'You don`t have permission to delete this comment',
      );
    }

    // If the comment does not exist, throw a NotFoundException
    if (!comment) {
      throw new NotFoundException(`Comment with id: ${id} not found`);
    }

    // Remove the comment from the database
    await this.commentRepository.remove(comment);

    delete comment.user;
    comment.id = id;

    // Return the deleted comment
    return comment;
  }
}
