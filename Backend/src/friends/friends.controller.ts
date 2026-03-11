import { Body, Controller, Param, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { RespondFriendRequestDto } from './dto/respond-request.dto';
import { SendFriendRequestDto } from './dto/send-request.dto';

@Controller('friends')
export class FriendsController {

    constructor(private service: FriendsService){}

    @Post("request")
    async sendRequest(@Body() dto: SendFriendRequestDto){
        return await this.service.sendRequest(
            dto
        );
    }

    @Post("respond")
    async respondRequest(@Body() dto: RespondFriendRequestDto){
        return await this.service.respondRequest(
            dto.requestId,
            dto.status 
        );
    }
    @Post(":userId")
    async getFriends(@Param("userId") userId: string)
    {
        return await this.service.getFriends(userId);
    }
}
