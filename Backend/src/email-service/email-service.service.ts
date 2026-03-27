import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { generateOtpEmail } from '../users/otp/templates/otp-templates'; 

@Injectable()
export class EmailServiceService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(email: string, otp: string): Promise<void> {
    try {
      const html_message =  generateOtpEmail;
      await this.transporter.sendMail({
        from: `"TOGETHER" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        html: html_message(otp, email)
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to send email: ${error.message}`);
    }
  }
}