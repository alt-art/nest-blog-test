import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { CreatePostDTO } from './post.dto';
import { PostService } from './post.service';

import { RolesGuard } from 'src/auth/roles.guard';
import { RequestWithUser } from 'src/user/user.controller';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() data: CreatePostDTO, @Request() req: RequestWithUser) {
    return this.postService.create(data, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    this.postService.delete(id);
  }
}
