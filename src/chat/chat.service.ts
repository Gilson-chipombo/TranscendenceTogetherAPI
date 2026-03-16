import { Injectable } from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';

@Injectable()
export class ChatService {
    constructor(private repository: ChatRepository){}

    async sendMessage(data){
        return await this.repository.saveMessage(data);
    }

    async getRoomMessage(roomId: string){
        return await this.repository.getRoomMessages(roomId);
    }
}
