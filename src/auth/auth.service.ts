import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    if (!(await compare(password, user.password))) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      ...user,
      token: this.jwtService.sign(payload),
    };
  }
}
