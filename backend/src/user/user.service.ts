import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Post } from '../posts/entities/post.entity';
import { CommentsService } from 'src/comments/comments.service';
import { Like } from '../votes/entities';

@Injectable()
export class UserService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly commentService: CommentsService,
  ) {}

  /**
   * Retrieves all users from the database.
   * @returns - An array of objects representing all the users in the database
   */
  async getAllUsers(): Promise<Array<User>> {
    try {
      // Find all the users
      const users = await this.userRepository.find();

      // Return the array of users
      return users;
    } catch (error) {
      // Handle any errors that may occur
      this.handleErrors(error);
    }
  }

  /**
   * Retrieves user information by ID, including comments and posts.
   * @param id - ID of the user to retrieve.
   */
  async getUser(id: string) {
    try {
      // Use query builder to retrieve user with comments and posts
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .getOne();

      // If user is not found, throw a NotFoundException
      if (!user) {
        throw new NotFoundException(`User with ID: ${id} not found`);
      }

      delete user.resetPasswordToken;
      delete user.roles;
      delete user.password;
      delete user.email;

      // Return the retrieved user
      return user;
    } catch (error) {
      // Handle any errors that may occur
      this.handleErrors(error);
    }
  }

  async getAllPostsLikedByUser(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.likes', 'userLikes')
      .leftJoinAndSelect('userLikes.post', 'postLiked')
      .leftJoinAndSelect('postLiked.likes', 'postsTotalLikes')
      .leftJoin('postLiked.user', 'postLikedUser')
      .addSelect([
        'postLikedUser.firstName',
        'postLikedUser.lastName',
        'postLikedUser.avatar',
        'postLikedUser.id',
        'postLikedUser.username',
      ])
      .where({ id })
      .getOne();

    if (!user) {
      throw new NotFoundException(`Not found user with ID: ${id}`);
    }

    const mappedLikedPosts = await Promise.all(
      user.likes.map(async ({ id, post }) => ({
        id,
        post: {
          id: post.id,
          likes: post.likes.length,
          slug: post.slug,
          tag: post.tag,
          title: post.title,
          comments: await this.commentService.getTotalComments(post.id),
          user: post.user,
        },
      })),
    );

    return mappedLikedPosts;
  }

  async getAllUserComments(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.comments', 'userComments')
      .leftJoinAndSelect('userComments.post', 'userCommentsPosts')
      .where({ id })
      .getOne();

    if (!user) {
      throw new NotFoundException(`Not found user with ID: ${id}`);
    }

    return user.comments;
  }

  async getAllUserPosts(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'posts')
      .leftJoinAndSelect('posts.likes', 'postsLikes')
      .leftJoin('posts.user', 'userPost')
      .addSelect([
        'userPost.firstName',
        'userPost.lastName',
        'userPost.avatar',
        'userPost.id',
        'userPost.username',
      ])
      .where({ id })
      .getOne();

    if (!user) {
      throw new NotFoundException(`Not found user with ID: ${id}`);
    }

    const mappedPosts = await Promise.all(
      user.posts.map(async ({ user, ...rest }) => ({
        likes: rest.likes.length,
        id: rest.id,
        slug: rest.slug,
        tag: rest.tag,
        title: rest.title,
        comments: await this.commentService.getTotalComments(rest.id),
        user,
      })),
    );

    return mappedPosts;
  }

  private handleErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Unexpected error: ${error}`);
    throw new InternalServerErrorException('Server error - check logs');
  }
}
