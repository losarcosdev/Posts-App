import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { AuthService } from '../auth/auth.service';
import { PostController } from './post.controller';
import { AuthModule } from '../auth/auth.module';
import { Comment } from '../comments/entities';
import { Post } from './entities';
import { CommentsService } from '../comments/comments.service';
import { Like } from '../votes/entities';

@Module({
  controllers: [PostController],
  providers: [PostService, AuthService, CommentsService],
  imports: [TypeOrmModule.forFeature([Post, Comment, Like]), AuthModule],
  exports: [PostService, TypeOrmModule],
})
export class PostModule {}
