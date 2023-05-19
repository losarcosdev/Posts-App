import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { QueryDto } from '../common/dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth(ValidRoles.user)
  @Post()
  @Auth()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll(
    @Query()
    queryDto: QueryDto,
  ) {
    return this.postService.findAll(queryDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.postService.findOne(term);
  }

  @Auth(ValidRoles.user)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Auth(ValidRoles.user)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.postService.remove(id, user);
  }
}
