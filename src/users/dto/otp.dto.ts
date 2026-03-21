import { IsString, IsNotEmpty } from "class-validator";

export class OtpDto{
    @IsString({message: "This value not is a string"})
    @IsNotEmpty({message: "the field can't empty"})
    temporary_id: string;

    @IsString({message: "This value not is a string"})
    @IsNotEmpty({message: "the field can't empty"})
    otp:string;
}