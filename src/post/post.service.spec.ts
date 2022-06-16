import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, PrismaService],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('findAll should return all posts', async () => {
    const posts = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    prismaService.post.findMany = jest.fn().mockResolvedValue(posts);
    expect(await service.findAll()).toEqual(posts);
  });

  it('findOne should return a post', async () => {
    const post = {
      id: 1,
      title: 'Post 1',
      content: 'Content 1',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaService.post.findUnique = jest.fn().mockResolvedValue(post);
    expect(await service.findOne(1)).toEqual(post);
    expect(prismaService.post.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('findOne should throw an error if we provide a invalid id', async () => {
    prismaService.post.findUnique = jest.fn().mockResolvedValue(null);
    try {
      await service.findOne(1);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Post not found');
      expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('create should create a post', async () => {
    const post = {
      id: 1,
      title: 'Post 1',
      content: 'Content 1',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaService.post.create = jest.fn().mockResolvedValue(post);
    expect(await service.create(post, post.authorId)).toEqual(post);
  });

  it('delete should delete a post', async () => {
    const post = {
      id: 1,
      title: 'Post 1',
      content: 'Content 1',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaService.post.delete = jest.fn().mockResolvedValue(post);
    expect(await service.delete(1)).toEqual(post);
    expect(prismaService.post.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
