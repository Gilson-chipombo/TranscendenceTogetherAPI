import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDateString, IsEmail, IsOptional, IsString, MinLength, isDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'The username of the user',
        example: 'Gilosn-Chipombo',
    })
    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    username?: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'P@ssw0rd123',
    })
    @IsOptional()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsString({ message: 'Password must be a string' })
    password?: string;

    @ApiProperty({
        description: 'The province of the user',
        example: 'New York',
    })
    @IsOptional()
    @IsString({ message: 'Province must be a string' })
    province?: string;

    @ApiProperty({
        description: 'The country of the user',
        example: 'Angola',
    })
    @IsOptional()
    @IsString({ message: 'Country must be a string' })
    country?: string;

    @ApiProperty({
        description: 'The birthdate of the user',
        example: '1990-01-01',
    })
    @IsOptional()
    @IsDateString({}, { message: 'Birthdate must be a valid date string' })
    birthdate?: string;

     @ApiProperty({
        description: 'The googleID of the user',
        example: 'ksdhfk93743!!2343435',
    })
    @IsOptional()
    @IsString({ message: 'Country must be a string' })
    googleID?: string;

     @ApiProperty({
        description: 'The first name of the user',
        example: 'Jose',
    })
    @IsOptional()
    @IsString({ message: 'Country must be a string' })
    firstName?: string;

     @ApiProperty({
        description: 'The last name of the user',
        example: 'Andre',
    })

    @IsOptional()
    @IsString({ message: 'Country must be a string' })
    lastName?: string;

     @ApiProperty({
        description: 'The binary file to the user\'s photo',
        example: '*USER-PHOTO-BINARY-FILE*',
    })
    @IsOptional()
    @IsString({ message: 'Country must be a string' })
    photo?: string;

     @ApiProperty({
        description: 'The phone number of the user',
        example: '9234567890',
    })
    @IsOptional()
    @IsString({ message: 'Country must be a string' })
    phone?: string;

}
