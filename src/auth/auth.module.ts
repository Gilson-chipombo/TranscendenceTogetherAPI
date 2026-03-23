import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RegisterModule } from '../users/register/register.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { EmailServiceModule } from '../email-service/email-service.module';
import { EmailServiceService } from '../email-service/email-service.service';
import { otpService } from '../users/otp/otp.service';
import { OtpModule } from '../users/otp/otp.module';

@Module({
  imports: [
    RegisterModule,
    PassportModule,
    EmailServiceModule,
    OtpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService, EmailServiceService, otpService],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
