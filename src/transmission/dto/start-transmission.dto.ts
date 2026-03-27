import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartTransmissionDto {
  @ApiProperty({
    description: 'The ID of the room where transmission will start',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
  })
  @IsString({ message: 'Room ID must be a string' })
  @IsNotEmpty({ message: 'Room ID is required' })
  @IsUUID('4', { message: 'Room ID must be a valid UUID' })
  roomId: string;
}
