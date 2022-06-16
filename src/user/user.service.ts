import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUser(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const emailExists = await this.prismaService.user.findUnique({
      where: { email: createUserDTO.email },
    });
    if (emailExists) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const pass = await hash(createUserDTO.password, 10);
    const user = await this.prismaService.user.create({
      data: { ...createUserDTO, password: pass },
    });
    return user;
  }

  async deleteUser(id: number) {
    await this.prismaService.user.delete({ where: { id } });
  }
}
