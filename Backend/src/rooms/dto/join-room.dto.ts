import { IsString, IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class JoinRoomDto {
    @ApiProperty({
        description: 'The unique invite token for the room - shared by room owner',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
        type: String,
    })
    @IsString({ message: 'Invite token must be a string' })
    @IsNotEmpty({ message: 'Invite token is required' })
    @IsUUID('4', { message: 'Invite token must be a valid UUID' })
    inviteToken: string;
}
