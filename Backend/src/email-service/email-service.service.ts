import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import *as nodemailer from "nodemailer"

@Injectable()
export class EmailServiceService {
  constructor() {}

  public sendEmail(): any {
  //const nodemailer = require("nodemailer");

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // Use true for port 465, false for port 587
        auth: {
          user: "gilsonvfs1@gmail.com",
          pass: "transcendence2026",
        },
      });

      // Send an email using async/await
      (async () => {
        const info = await transporter.sendMail({
          from: '"Andre e Gilson" <gilsonvfs1@gmail.com>',
          to: "josefuxi2000@gmail.com",
          subject: "Hello WOrld Gmail",
          text: "Hello WOrld Gmail", // Plain-text version of the message
          html: "<b>Hello world?</b>", // HTML version of the message
        });

        console.log("Message sent:", info.messageId);
      })();
      return "Cheguei ate aqui";
  }
}

// import { Injectable } from "@nestjs/common";
// import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {

  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  async sendOtp(email: string, otp: string) {

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your verification code is: ${otp}`
    });

  }

}