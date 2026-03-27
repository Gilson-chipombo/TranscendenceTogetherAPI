import { Injectable } from "@nestjs/common";
import { EmailServiceService } from "../../email-service/email-service.service";
import { otpService } from "./otp.service";

@Injectable()
export class ResetPwService{
    constructor(private emailService: EmailServiceService, private otpService: otpService) {
    }
    async sendResetPasswordEmail(name: string): Promise<void> {
        const otp = this.otpService.generateOtp();
        await this.emailService.sendEmail(name, otp);
    }
}