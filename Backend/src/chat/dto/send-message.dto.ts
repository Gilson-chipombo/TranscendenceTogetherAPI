import { IsString } from "class-validator";

export class SendMessageDto {
    @IsString()
    roomId: string;

    @IsString()
    userId: string;

    @IsString()

    content: string;
}
