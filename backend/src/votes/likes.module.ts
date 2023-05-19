import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PostModule } from 'src/posts/post.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
  imports: [
    PostModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Like]),
  ],
})
export class LikesModule {}
