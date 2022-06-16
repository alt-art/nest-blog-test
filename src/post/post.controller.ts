import {
  Body,
  Controller,
  Get,
  Param,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CreatePostDTO } from './post.dto';
import { PostService } from './post.service';
import { RolesGuard } from '../auth/roles.guard';
import { RequestWithUser } from '../user/user.controller';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
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
  delete(@Param('id') id: number) {
    this.postService.delete(id);
  }
}
