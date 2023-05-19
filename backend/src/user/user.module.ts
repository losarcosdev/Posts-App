import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PostModule } from '../posts/post.module';
import { CommentsService } from '../comments/comments.service';
import { Like } from '../votes/entities';

@Module({
  controllers: [UserController],
  providers: [UserService, CommentsService],
  imports: [TypeOrmModule.forFeature([User, Like]), PostModule],
})
export class UserModule {}
