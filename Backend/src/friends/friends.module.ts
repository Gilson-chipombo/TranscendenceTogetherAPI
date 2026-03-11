import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendsRepository } from './repository/friends.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [FriendsService, FriendsRepository, PrismaService],
  controllers: [FriendsController]
})
export class FriendsModule {}
