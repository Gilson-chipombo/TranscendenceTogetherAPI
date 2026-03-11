import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './repository/rooms.repository';

@Module({
  providers: [RoomsService, RoomsRepository],
  controllers: [RoomsController]
})
export class RoomsModule {}
