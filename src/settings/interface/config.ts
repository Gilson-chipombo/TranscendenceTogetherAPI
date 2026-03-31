import { IsString, IsNotEmpty } from "class-validator";

export class ColorsDto {
    @IsString()
    @IsNotEmpty()
        background: string

    @IsString()
    @IsNotEmpty()
        card: string

    @IsNotEmpty()
    @IsString()
        primary: string

    @IsString()
    @IsNotEmpty()
        accent: string

    @IsString()
    @IsNotEmpty()
        foreground: string
}