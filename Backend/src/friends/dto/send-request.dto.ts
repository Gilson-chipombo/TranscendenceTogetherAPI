import { IsString } from "class-validator";

export class SendFriendRequestDto {
    @IsString()
    requesterId: string;

    @IsString()
    receiverId: string;
}
