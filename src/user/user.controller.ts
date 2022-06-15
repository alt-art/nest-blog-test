import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as Req } from 'express';
import { User } from '@prisma/client';
import { CreateUserDTO } from './user.dto';
import { UserService } from './user.service';

export type RequestWithUser = Req & { user: User };

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUser(@Request() req: RequestWithUser) {
    return this.appService.getUser(req.user.id);
  }

  @Post()
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.appService.createUser(createUserDTO);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  deleteUser(@Request() req: RequestWithUser) {
    return this.appService.deleteUser(req.user.id);
  }
}
