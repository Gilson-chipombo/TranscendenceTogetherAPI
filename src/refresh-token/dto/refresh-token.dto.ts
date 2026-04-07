import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refresh_token: string;
}