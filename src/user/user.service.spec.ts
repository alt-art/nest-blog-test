import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';

describe('PostService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('getUser should return a user', async () => {
    const user = {
      id: 1,
      email: 'john@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
    expect(await service.getUser(1)).toEqual(user);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('getUser should throw an error if we provide a invalid id', async () => {
    prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
    try {
      await service.getUser(1);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('createUser should return a user', async () => {
    const user = {
      id: 1,
      email: 'john@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
    prismaService.user.create = jest.fn().mockResolvedValue(user);
    expect(
      await service.createUser({
        email: 'john@test.com',
        password: 'i love banana',
      }),
    ).toEqual(user);
  });

  it('createUser should throw an error if email is already used', async () => {
    prismaService.user.findUnique = jest.fn().mockResolvedValue({
      id: 1,
      email: 'john@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      await service.createUser({
        email: 'john@test.com',
        password: 'i love banana',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Email already exists');
      expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
    }
  });

  it('deleteUser should delete a user', async () => {
    prismaService.user.delete = jest.fn().mockResolvedValue(true);
    await service.deleteUser(1);
    expect(prismaService.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
