import { Controller, Param, Delete, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Auth(ValidRoles.user)
  @Get(':id')
  create(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.likesService.addLike(id, user);
  }

  @Auth(ValidRoles.user)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.likesService.removeVote(id, user);
  }

  @Get('/allLikes/:id')
  getAllPostLikes(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.likesService.getAllPostLikes(id);
  }
}
