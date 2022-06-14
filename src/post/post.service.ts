import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDTO } from './post.dto';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.post.findMany();
  }

  async findOne(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }

  async create(data: CreatePostDTO, userId: number) {
    return this.prismaService.post.create({
      data: { ...data, authorId: userId },
    });
  }

  async delete(id: number) {
    return this.prismaService.post.delete({ where: { id } });
  }
}
