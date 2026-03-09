import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { RegisterRepository } from './repository/register.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jose0849739753573jJIIJSJHjjsj_123923..',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [RegisterController],
  providers: [RegisterService, RegisterRepository, PrismaService],
  exports: [RegisterService, RegisterRepository, PrismaService],
})
export class RegisterModule {}
