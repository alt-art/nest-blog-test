import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getUser(id);
  }

  @Post()
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.appService.createUser(createUserDTO);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteUser(id);
  }
}
