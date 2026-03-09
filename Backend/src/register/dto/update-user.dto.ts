import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDateString, IsEmail, IsOptional, IsString, MinLength, isDateString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    username?: string;

    @IsOptional()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsString({ message: 'Password must be a string' })
    password?: string;

    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    province?: string;

    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    country?: string;

    @IsDateString({}, { message: 'Birthdate must be a valid date string' })
    birthdate?: string;

}
