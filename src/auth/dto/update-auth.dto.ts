import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {

}

export class UpdatePwDto extends PartialType(CreateAuthDto) {
    @IsEmail({}, {message: "email is invalid"})
    @IsNotEmpty()
        email: string;
    @IsNotEmpty()
    @IsString()
        password: string;
}
