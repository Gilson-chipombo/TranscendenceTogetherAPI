import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OtpDto{
    @ApiProperty({
        description: 'The temporary ID for OTP verification',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsString({message: "This value not is a string"})
    @IsNotEmpty({message: "the field can't empty"})
    temporary_id: string;

    @ApiProperty({
        description: 'The OTP code',
        example: '123456',
    })
    @IsString({message: "This value not is a string"})
    @IsNotEmpty({message: "the field can't empty"})
    otp:string;
}