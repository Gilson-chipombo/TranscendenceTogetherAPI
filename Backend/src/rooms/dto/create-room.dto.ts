import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoomDto {
    @ApiProperty({
        description: 'The name of the room - will be displayed to all users',
        example: 'General Chat',
        minLength: 1,
        maxLength: 50,
        type: String,
    })
    @IsString({ message: 'Room name must be a string' })
    @IsNotEmpty({ message: 'Room name is required' })
    @MinLength(1, { message: 'Room name cannot be empty' })
    @MaxLength(50, { message: 'Room name cannot exceed 50 characters' })
    name: string;
}

