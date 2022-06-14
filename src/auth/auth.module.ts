import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { secret } from 'src/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: secret,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
