import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendFriendRequestDto {
    @ApiProperty({
        description: 'The ID of the user to send a friend request to',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
        format: 'uuid',
    })
    @IsString({ message: 'Receiver ID must be a string' })
    @IsNotEmpty({ message: 'Receiver ID is required' })
    @IsUUID('4', { message: 'Receiver ID must be a valid UUID' })
    receiverId: string;
}

