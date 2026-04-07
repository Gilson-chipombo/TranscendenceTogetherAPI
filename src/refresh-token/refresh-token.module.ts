import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RegisterRepository } from '../users/repository/register.repository';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenController } from './refresh-token.controller';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { otpService } from '../users/otp/otp.service';
import { EmailServiceService } from '../email-service/email-service.service';
@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '15m' },
  })],
  // imports: [RegisterRepository],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, RegisterRepository, PrismaService, RedisService, JwtService, AuthService, otpService, EmailServiceService],
  // exports: [RegisterRepository]
})
export class RefreshTokenModule {}
