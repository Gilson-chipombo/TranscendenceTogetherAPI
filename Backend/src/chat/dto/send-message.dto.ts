import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class SendMessageDto {
    @IsString({ message: 'Room ID must be a string' })
    @IsNotEmpty({ message: 'Room ID is required' })
    roomId: string;

    @IsString({ message: 'User ID must be a string' })
    @IsNotEmpty({ message: 'User ID is required' })
    userId: string;

    @IsString({ message: 'Content must be a string' })
    @IsNotEmpty({ message: 'Message content is required' })
    @MinLength(1, { message: 'Message cannot be empty' })
    @MaxLength(5000, { message: 'Message must not exceed 5000 characters' })
    content: string;
}
