import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { PostModule } from './post/post.module';

@Module({
  imports: [UserModule, AuthModule, PostModule],
  controllers: [AppController],
})
export class AppModule {}
