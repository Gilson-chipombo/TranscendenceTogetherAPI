import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendMessageDto {
    @ApiProperty({
        description: 'The ID of the room where the message will be sent',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
    })
    @IsString({ message: 'Room ID must be a string' })
    @IsNotEmpty({ message: 'Room ID is required' })
    roomId: string;

    @ApiProperty({
        description: 'The ID of the user sending the message',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsString({ message: 'User ID must be a string' })
    @IsNotEmpty({ message: 'User ID is required' })
    userId: string;

    @ApiProperty({
        description: 'The content of the message',
        example: 'Hello everyone! This is my first message.',
        minLength: 1,
        maxLength: 5000,
        type: String,
    })
    @IsString({ message: 'Content must be a string' })
    @IsNotEmpty({ message: 'Message content is required' })
    @MinLength(1, { message: 'Message cannot be empty' })
    @MaxLength(5000, { message: 'Message must not exceed 5000 characters' })
    content: string;
}
