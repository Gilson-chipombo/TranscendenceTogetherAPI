import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { RegisterRepository } from '../repository/register.repository';
import { PrismaService } from '../../prisma/prisma.service';
import {SearchUser} from '../search/search-user.service'
import { OtpModule } from '../otp/otp.module';
import { otpService } from '../otp/otp.service';
import { EmailServiceService } from '../../email-service/email-service.service';
import { EmailServiceModule } from '../../email-service/email-service.module';
import { RedisService } from '../../redis/redis.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jose0849739753573jJIIJSJHjjsj_123923..',
      signOptions: { expiresIn: '7d' },
    }), 
    OtpModule, EmailServiceModule,
  ],
  controllers: [RegisterController],
  providers: [RegisterService, RegisterRepository, PrismaService, SearchUser, otpService, EmailServiceService, RedisService],
  exports: [RegisterService, RegisterRepository, PrismaService, SearchUser, RedisService],
})
export class RegisterModule {}
