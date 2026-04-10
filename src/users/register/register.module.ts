import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { RegisterRepository } from '../repository/register.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { OtpModule } from '../otp/otp.module';
import { otpService } from '../otp/otp.service';
import { EmailServiceService } from '../../email-service/email-service.service';
import { EmailServiceModule } from '../../email-service/email-service.module';
import { RedisService } from '../../redis/redis.service';
import { SettingsService } from '../../settings/settings.service';
import { SettingsModule } from '../../settings/settings.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jose0849739753573jJIIJSJHjjsj_123923..',
      signOptions: { expiresIn: '7d' },
    }), 
    OtpModule, EmailServiceModule, SettingsModule,
  ],
  controllers: [RegisterController],
  providers: [RegisterService, RegisterRepository, PrismaService, otpService, EmailServiceService, RedisService, SettingsService],
  exports: [RegisterService, RegisterRepository, PrismaService, RedisService],
})
export class RegisterModule {}
