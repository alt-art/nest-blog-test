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
import { CreateUserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUser(@Request() req: any) {
    return this.appService.getUser(req.user.id);
  }

  @Post()
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.appService.createUser(createUserDTO);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  deleteUser(@Request() req: any) {
    return this.appService.deleteUser(req.user.id);
  }
}
