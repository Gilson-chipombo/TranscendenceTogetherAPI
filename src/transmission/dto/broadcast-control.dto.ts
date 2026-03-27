import { IsString, IsNotEmpty, IsUUID, IsIn, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BroadcastControlDto {
  @ApiProperty({
    description: 'The ID of the room',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
  })
  @IsString({ message: 'Room ID must be a string' })
  @IsNotEmpty({ message: 'Room ID is required' })
  @IsUUID('4', { message: 'Room ID must be a valid UUID' })
  roomId: string;

  @ApiProperty({
    description: 'Control action: play, pause, or seek',
    example: 'play',
    type: String,
    enum: ['play', 'pause', 'seek'],
  })
  @IsString({ message: 'Action must be a string' })
  @IsNotEmpty({ message: 'Action is required' })
  @IsIn(['play', 'pause', 'seek'], { message: 'Action must be one of: play, pause, seek' })
  action: 'play' | 'pause' | 'seek';

  @ApiProperty({
    description: 'Video timestamp in milliseconds (required for seek)',
    example: 120000,
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Timestamp must be a number' })
  @Min(0, { message: 'Timestamp must be greater than or equal to 0' })
  timestamp?: number;
}
