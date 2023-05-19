import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUser(id);
  }

  @Get('/:id/liked-posts')
  getAllPostsLikedByUser(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.userService.getAllPostsLikedByUser(id);
  }

  @Get('/:id/comments')
  getAllUserComments(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getAllUserComments(id);
  }

  @Get('/:id/posts')
  getAllUserPosts(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getAllUserPosts(id);
  }
}
