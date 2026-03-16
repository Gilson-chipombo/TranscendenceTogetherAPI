import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './repository/rooms.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [RoomsService, RoomsRepository, PrismaService],
  controllers: [RoomsController]
})
export class RoomsModule {}
