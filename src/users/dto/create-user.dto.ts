import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
export enum gender{
  MASCULINO = 'masculino',
  FEMININO = 'feminino',
}

export class InitUserDto{
  @ApiProperty({
    description: 'The email for the user',
    example: 'exemplo.@gmal.com'
  })
  @IsString()
  @IsNotEmpty()
    email: string;

   @ApiProperty({
    description: 'The email of the user',
    example: 'My_password-1234'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
    password: string;
}

export class CreateUserDto extends PartialType(InitUserDto){
  @ApiProperty({
    description: 'The name of the user',
    example: 'Gilson-Chipombo',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'Jose',
  })
  @IsString()
  firstName: string;


  @ApiProperty({
    description: 'The last name of the user',
    example: 'Andre',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'angeleLUZI@gmail.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The birthday of the user',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDate()
  birthDay?: Date;

  @ApiProperty({
    description: 'The country of the user',
    example: 'Angola',
  })
  @IsOptional()
  @IsString()
  country: string;

  @IsString()
  @IsNotEmpty()
    uuid:string

  @ApiProperty({
    description: 'The photo of the user',
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @IsString()
  photo: string;
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+244 912345678',
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The province of the user',
    example: 'Luanda',
  })
  @IsOptional()
  @IsString()
  province: string;
  
  @ApiProperty({
    description: 'The gender of the user',
    example: 'masculino',
    enum: gender,
  })
  @IsOptional()
  @IsEnum(gender)
  gender?: gender
}
