import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private service: UserService){}

    @Post()
    create(@Body() dto: CreateUserDto){
        return this.service.createUser(dto);
    }

    @Get()
    findAll(){
        return this.service.findAll();
    }
}
