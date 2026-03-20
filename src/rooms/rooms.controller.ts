import { Body, Controller, Get, HttpCode, Param, Post, Res } from '@nestjs/common';
import { RoomsRepository } from './repository/rooms.repository';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
    constructor(private service: RoomsRepository){}

    @Post()
    @HttpCode(201)
    async create(@Body() dto: CreateRoomDto){
        const room = this.service.create(dto);
        return room;
    }

    @Get("invite/:token")
    async JoinByEnvite(@Param("token") token: string)
    {
        return this.service.findByInvite(token);
    }
}
