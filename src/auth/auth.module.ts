import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'
import { AdminModule } from '../admin/admin.module';
import { AdminService } from '../admin/admin.service';
import { UserModule } from '../users/user.module';


@Module({
  imports: [
    JwtModule.register({
      secret: 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    AdminModule
  ],
  providers: [
    AuthService,
    AdminService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
