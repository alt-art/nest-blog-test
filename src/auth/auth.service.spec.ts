import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { secret } from '../config';
import { PrismaService } from '../prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: secret,
        }),
      ],
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  describe('validateUser', () => {
    it('should be validate a user if we provide a valid email and password', async () => {
      const user = {
        id: 1,
        email: 'john@test.com',
        password: await hash('i love banana', 10),
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
      expect(await service.validateUser(user.email, 'i love banana')).toEqual({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it('should not validate a user if we provide a invalid email', async () => {
      const user = {
        id: 1,
        email: 'john@test.com',
        password: await hash('i love banana', 10),
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
      expect(await service.validateUser(user.email, user.password)).toBeNull();
    });

    it('should not validate a user if we provide a invalid password', async () => {
      const user = {
        id: 1,
        email: 'john@test.com',
        password: await hash('i love banana', 10),
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
      expect(await service.validateUser(user.email, 'i love apple')).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a token if we provide a valid user', async () => {
      const user = {
        id: 1,
        email: 'john@test.com',
        password: await hash('i love banana', 10),
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(await service.login(user)).toEqual({
        ...user,
        token: expect.any(String),
      });
    });
  });
});
