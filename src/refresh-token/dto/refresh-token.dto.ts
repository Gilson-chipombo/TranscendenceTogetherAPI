import { IsString, IsNotEmpty } from "class-validator";

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refresh_token: string;

    @IsNotEmpty()
    @IsString()
    id?: string;
    @IsString()
    role?: string;
}