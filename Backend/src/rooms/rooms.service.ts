import { Injectable } from '@nestjs/common';
import { RoomsRepository } from './repository/rooms.repository';

@Injectable()
export class RoomsService {
    constructor(private repository: RoomsRepository){}

    async createRoom(data){
        return this.repository.create(data);
    }

    async findByInvite(token: string){
        return this.repository.findByInvite(token);
    }
}
