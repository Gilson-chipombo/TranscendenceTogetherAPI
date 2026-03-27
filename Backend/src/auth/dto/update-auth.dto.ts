import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @ApiProperty({
    description: 'New email address (optional)',
    example: 'newemail@example.com',
    type: String,
    format: 'email',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'New password (optional)',
    example: 'newpassword123',
    type: String,
    minLength: 6,
    required: false,
  })
  password?: string;
}

