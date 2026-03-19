import { IsDate, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  name: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsDate()
  birthDay?: Date;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  photo: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  province: string;
  

  @IsString()
  gender?: string
}
