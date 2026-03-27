import { IsString, IsNotEmpty, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendDmDto {
  @ApiProperty({
    description: 'The ID of the user receiving the direct message',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
  })
  @IsString({ message: 'Receiver ID must be a string' })
  @IsNotEmpty({ message: 'Receiver ID is required' })
  @IsUUID('4', { message: 'Receiver ID must be a valid UUID' })
  receiverId: string;

  @ApiProperty({
    description: 'The content of the direct message',
    example: 'Hey, how are you?',
    type: String,
    minLength: 1,
    maxLength: 5000,
  })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(1, { message: 'Content must be at least 1 character' })
  @MaxLength(5000, { message: 'Content must not exceed 5000 characters' })
  content: string;
}
