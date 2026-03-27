import { Injectable } from "@nestjs/common";
import { RegisterModule } from "../register/register.module";
import * as crypto from "crypto";

@Injectable()
export class otpService{
    generateOtp(length: number = 6): string {
        let otp = crypto.randomInt(0, Math.pow(10, length)).toString();
        return otp.padStart(length, '0');
    }
}