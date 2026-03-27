import { IsString, IsNotEmpty, IsIn, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RespondFriendRequestDto {
    @ApiProperty({
        description: 'The ID of the friend request to respond to',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
        format: 'uuid',
    })
    @IsString({ message: 'Request ID must be a string' })
    @IsNotEmpty({ message: 'Request ID is required' })
    @IsUUID('4', { message: 'Request ID must be a valid UUID' })
    requestId: string;

    @ApiProperty({
        description: 'Response status - accept or reject the friend request',
        example: 'accepted',
        type: String,
        enum: ['accepted', 'rejected'],
    })
    @IsString({ message: 'Status must be a string' })
    @IsNotEmpty({ message: 'Status is required' })
    @IsIn(['accepted', 'rejected'], { message: 'Status must be either "accepted" or "rejected"' })
    status: 'accepted' | 'rejected';
}

