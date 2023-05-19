import { Injectable, Logger } from '@nestjs/common';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities';
import { Post } from '../posts/entities';
import { Like } from './entities';

@Injectable()
export class LikesService {
  private readonly logger = new Logger('PostsCommentsService');
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addLike(id: string, user: User) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException(`Not found post with id: ${id}`);
    }

    const like = this.likeRepository.create({ user, post });

    await this.likeRepository.save(like);

    post.likes.push(like); // Agregamos el voto al arreglo de votos del post
    post.likeCount++;

    await this.postRepository.save(post);

    return like.id;
  }

  async getAllPostLikes(id: string) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException(`Not found post with id: ${id}`);
    }

    try {
      const { likes } = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.likes', 'likes')
        .leftJoin('likes.user', 'likesUser')
        .addSelect(['likesUser.id', 'likesUser.username'])
        .where({ id })
        .getOne();

      return likes;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async removeVote(id: string, user: User) {
    const like = await this.likeRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.user', 'user')
      .leftJoinAndSelect('like.post', 'post')
      .where({ id })
      .getOne();

    if (like.user.id !== user.id || like.id !== id) {
      throw new UnauthorizedException(
        'You do not have the permission to delete this vote',
      );
    } else {
      if (like.post.likeCount > 0) {
        like.post.likeCount--;
      }

      this.likeRepository.remove(like);

      return {
        ...like,
        message: `Like: ${like.id} deleted successfully`,
      };
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
