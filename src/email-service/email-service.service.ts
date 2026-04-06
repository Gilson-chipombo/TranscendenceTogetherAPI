import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { generateOtpEmail } from '../users/otp/templates/otp-templates'; 

@Injectable()
export class EmailServiceService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      // port: 587,
      secure: false,
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



// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import { google } from 'googleapis';
// import { generateOtpEmail } from '../users/otp/templates/otp-templates';

// @Injectable()
// export class EmailServiceService {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     this.initTransporter();
//   }

//   private async initTransporter() {
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       'https://developers.google.com/oauthplayground',
//     );

//     oauth2Client.setCredentials({
//       refresh_token: process.env.REFRESH_TOKEN,
//     });

//     const accessToken = await oauth2Client.getAccessToken();

//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         user: process.env.EMAIL_USER,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//         accessToken: accessToken.token,
//       },
//     });
//   }

//   async sendEmail(email: string, otp: string): Promise<void> {
//     try {
//       if (!this.transporter) {
//         await this.initTransporter();
//       }

//       const html_message = generateOtpEmail;
//       await this.transporter.sendMail({
//         from: `"TOGETHER" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: 'Your OTP Code',
//         html: html_message(otp, email),
//       });
//     } catch (error) {
//       throw new InternalServerErrorException(`Failed to send email: ${error.message}`);
//     }
//   }
// }