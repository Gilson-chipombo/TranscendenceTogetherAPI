import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';
import { GoogleStrategy } from './repository/auth-google.strategy';
import { AuthGoogleRepository } from './repository/authgoogle.repository';
import { RegisterRepository } from '../users/repository/register.repository';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService, GoogleStrategy, AuthGoogleRepository, PrismaService, RegisterRepository, RedisService],
  // exports: [RegisterRepository],
})
export class AuthGoogleModule {}
