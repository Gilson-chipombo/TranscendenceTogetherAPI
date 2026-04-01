import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RegisterRepository } from '../users/repository/register.repository';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  // imports: [RegisterRepository],
  controllers: [],
  providers: [RefreshTokenService, RegisterRepository, PrismaService, RedisService, JwtService],
  // exports: [RegisterRepository]
})
export class RefreshTokenModule {}
