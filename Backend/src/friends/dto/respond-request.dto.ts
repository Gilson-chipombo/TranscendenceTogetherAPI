import { IsString } from "class-validator";

export class RespondFriendRequestDto {

    @IsString()
    id: string

    @IsString()
    requestId: string;

    @IsString()
    status: string;
}
