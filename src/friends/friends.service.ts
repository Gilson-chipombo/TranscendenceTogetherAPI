import { Injectable } from '@nestjs/common';
import { FriendsRepository } from './repository/friends.repository';

@Injectable()
export class FriendsService {
    constructor(private repository: FriendsRepository){}

    async sendRequest(data){
        return await this.repository.sendRequest(data);
    }

    async respondRequest(requestId: string, status: string){
        return this.repository.respondRequest(requestId, status);
    }

    async getFriends(userId: string){
        return this.repository.getFriends(userId);
    }
}
