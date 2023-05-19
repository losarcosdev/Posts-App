import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities';
import { CreatePostDto, UpdatePostDto } from './dto';
import { validate as isUUID } from 'uuid';
import { QueryDto } from '../common/dto';
import { User } from '../user/entities/user.entity';
import { CommentsService } from '../comments/comments.service';
import { Like } from '../votes/entities';

@Injectable()
export class PostService {
  private readonly logger = new Logger('PostService');

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly commentService: CommentsService,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  /**
   * Creates a new post, maps image URLs to image objects, and saves the post to the database.
   * @param createPostDto - An object containing the properties for the new post, including an optional array of image URLs.
   * @param user - The user who is creating the post.
   */
  async create(createPostDto: CreatePostDto, user: User) {
    try {
      const newPost = createPostDto;

      // Create a new "post" object using the rest of the properties and map the array of images to an array of image objects with a url property
      const post = this.postRepository.create({
        ...newPost,
        user,
      });

      // Save the new post to the database
      await this.postRepository.save(post);

      // Return the post with the images
      return { ...post };
    } catch (error) {
      // Handle any errors that may occur
      this.handleErrors(error);
    }
  }

  /**
   * Retrieves all posts from the database, ordered by title, and including related images and comments.
   * @param queryDto - An object containing the order_title property to specify the order of the retrieved posts.
   * @returns - An array of objects representing the retrieved posts.
   */
  async findAll(queryDto: QueryDto) {
    const { order_title, tag_selected, order_likes } = queryDto;

    try {
      // Find all posts, order by title, and include related comments
      const posts = await this.postRepository.find({
        order: { title: order_title, likeCount: order_likes },
        where: { tag: tag_selected },
        relations: { comments: true },
      });

      const mappedPosts = await Promise.all(
        posts.map(async ({ user, ...rest }) => ({
          likes: rest.likes,
          likeCount: rest.likes.length,
          id: rest.id,
          slug: rest.slug,
          tag: rest.tag,
          title: rest.title,
          comments: await this.commentService.getTotalComments(rest.id),
          user: {
            avatar: user.avatar,
            firstName: user.firstName,
            id: user.id,
            lastName: user.lastName,
            username: user.username,
          },
        })),
      );

      // Return the mapped posts
      return mappedPosts;
    } catch (error) {
      // Handle any errors that may occur
      this.handleErrors(error);
    }
  }

  /**
   * Retrieves a single post by its slug or ID.
   * @param term - The slug or ID of the post to retrieve.
   * @returns - An object containing the retrieved post and its corresponding user.
   */
  async findOne(term: string) {
    try {
      // Declare a condition object with the slug property set to the provided term
      let condition: object = { slug: term };

      // Check if the provided term is a UUID
      if (isUUID(term)) {
        // If it is, set the condition object's id property to the provided term
        condition = { id: term };
      }

      // Use query builder to find the post with the provided term, include related comments and their corresponding users
      const post: any = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.likes', 'likes')
        .leftJoin('post.user', 'user')
        .addSelect([
          'user.avatar',
          'user.firstName',
          'user.id',
          'user.lastName',
          'user.username',
        ])
        .where(condition)
        .getOne();

      // If the post is not found, throw a NotFoundException
      if (!post) {
        throw new NotFoundException(`Not found a post with that term: ${term}`);
      }

      post.likes = post.likes.length;
      post.comments = await this.commentService.getTotalComments(post.id);
      // Return the retrieved post and its corresponding user
      return post;
    } catch (error) {
      // Handle any errors that may occur
      this.handleErrors(error);
    }
  }

  /**
   * Update a post by its id.
   * @param id - The id of the post to update.
   * @param updatePostDto - An object containing the new post information.
   * @returns - An object representing the updated post.
   */
  async update(id: string, updatePostDto: UpdatePostDto) {
    // Destructure the images property from the updatePostDto object
    const { ...rest } = updatePostDto;

    // Load the specified post from the database
    const post = await this.postRepository.preload({ id, ...rest });

    // If the post does not exist, throw a NotFoundException
    if (!post) {
      throw new NotFoundException(`Post with id: ${id} not found`);
    }

    await this.postRepository.save(post);
    return post;
  }

  /**
   * Removes a post by its ID from the database.
   * @param id - The ID of the post to remove.
   * @returns - A message indicating that the post was deleted successfully.
   */
  async remove(id: string, user: User): Promise<Post> {
    try {
      // Find the post with the provided ID
      const post = await this.postRepository.findOneBy({ id });
      // If the post is not found, throw a NotFoundException
      if (!post) {
        throw new NotFoundException(`Post with ID: ${id} does not exist`);
      }

      if (user.id !== post.user.id) {
        throw new UnauthorizedException(
          'You do not have permission to delete this post',
        );
      }

      // Remove any related likes from the database
      await this.likeRepository.delete({ post: { id } });

      // Remove the post from the database
      await this.postRepository.remove(post);
      // Return a message indicating that the post was deleted successfully
      return post;
    } catch (error) {
      // Handle any errors that may occur
      this.handleErrors(error);
    }
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(`Unexpected error: ${error}`);
    throw new InternalServerErrorException('Server error - check logs');
  }
}
