import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomsRepository } from './repository/rooms.repository';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
    constructor(private service: RoomsRepository){}

    @Post()
    async create(@Body() dto: CreateRoomDto){
        return this.service.create(dto);
    }

    @Get("invite/:token")
    async JoinByEnvite(@Param("token") token: string)
    {
        return this.service.findByInvite(token);
    }
}
