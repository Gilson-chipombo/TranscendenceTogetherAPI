import { Inject } from "@nestjs/common";
import { IsEmail, IsNotEmpty } from "class-validator";


export class CreateAuthDto {
    @IsEmail({}, {message: "Invalid email format"})
    @IsNotEmpty({message: "email is required"})
    email:string

    @IsNotEmpty({message: "password is required"})
    password: string
}

