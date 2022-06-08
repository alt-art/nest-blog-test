import { HttpException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { SignJWT } from 'jose';
import { secret } from './config';
import prisma from './prisma';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  async getUser(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const pass = await hash(createUserDTO.password, 10);
    const user = await prisma.user.create({
      data: {
        email: createUserDTO.email,
        password: pass,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const token = await new SignJWT({
      email: user.email,
      id: user.id,
    })
      .setProtectedHeader({
        alg: 'HS256',
      })
      .sign(secret);
    return {
      token,
      user,
    };
  }

  async deleteUser(id: number) {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
