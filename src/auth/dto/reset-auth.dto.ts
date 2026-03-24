import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class ResetAuthDto
{
    @IsNotEmpty()
    @IsString()
        uuid: string
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
        otp: string
}

export class SetNewPassWordDto{
    @IsNotEmpty()
    @IsString()
        uuid: string;
    @IsNotEmpty()
    @IsString()
        password: string;

}