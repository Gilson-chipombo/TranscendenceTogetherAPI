import {otpService} from "./otp.service";
import {Module} from "@nestjs/common";
import {ResetPwService} from "./reset-pw.service";
import {EmailServiceService} from "../../email-service/email-service.service";
import { RegisterModule } from "../register/register.module";

@Module({
    imports: [],
    providers: [otpService, ResetPwService, EmailServiceService],
    exports: [otpService, ResetPwService]
})
export class OtpModule{}