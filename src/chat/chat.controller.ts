import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private service: ChatService){}

    @Get('room/:roomId')
    getMessages(@Param('roomId') roomId: string){
        return this.service.getRoomMessage(roomId);
    }
}
