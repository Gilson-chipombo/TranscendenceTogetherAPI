import { IsString, IsNotEmpty } from "class-validator";

export class CreateAuthGoogleDto {
    @IsString()
    @IsNotEmpty()
    googID: string;
    name: string;
    email: string;
}
