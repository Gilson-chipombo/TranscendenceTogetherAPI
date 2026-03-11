import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { SendDmDto } from './dto/send-dm.dto';

@Controller('dm')
export class DirectMessageController {
    constructor(private service: DirectMessageService){}

    @Post()
    async sendMessage(@Body() dto: SendDmDto){
        return await this.service.sendMassage(dto);
    }

    @Get(":user1/user2")
    async getConversation(
        @Param("user1") user1: string,
        @Param("user2") user2: string
    ){
        return await this.service.getConversation(user1, user2);
    }
}
