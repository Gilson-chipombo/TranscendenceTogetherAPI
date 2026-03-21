import { Injectable } from '@nestjs/common';
import { RoomsRepository } from './repository/rooms.repository';
import { Room } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
    constructor(private repository: RoomsRepository){}

    async createRoom(data: CreateRoomDto): Promise<Room>{
        return this.repository.create(data);
    }

    async findByInvite(token: string){
        return this.repository.findByInvite(token);
    }
}
