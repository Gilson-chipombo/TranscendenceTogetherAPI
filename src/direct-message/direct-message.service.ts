import { Injectable } from '@nestjs/common';
import { DmRepository } from './repository/dm.repository';

@Injectable()
export class DirectMessageService {
    constructor(private repository: DmRepository){}

    async sendMassage(data){
        return await this.repository.sendMessage(data);
    }

    async getConversation(user1: string, user2: string){
        return await this.repository.getConversation(user1, user2);
    }

}
