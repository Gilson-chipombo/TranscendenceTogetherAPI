import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { RegisterModule } from './users/register/register.module';
import { AuthModule } from './auth/auth.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { JwtAuthGuardGlobal } from './auth/guards/jwt-auth-global.guard';
import { AdminModule } from './admin/admin.module';
import { RoomsModule } from './rooms/rooms.module';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';
import { DirectMessageModule } from './direct-message/direct-message.module';
import { TransmissionModule } from './transmission/transmission.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import {
  LoggerMiddleware,
  SanitizationMiddleware,
  SecurityHeadersMiddleware,
  RateLimitMiddleware,
  ErrorHandlingMiddleware,
  RequestIdMiddleware,
} from './middlewares';
// import { EmailServiceModule } from './email-service/email-service.module';
import { EmailServiceModule } from './email-service/email-service.module';
import { OtpModule } from './users/otp/otp.module';
import { RedisService } from './redis/redis.service';
import { SettingsService } from './settings/settings.service';
import { SettingsController } from './settings/settings.controller';
import { SettingsModule } from './settings/settings.module';
import { CloudinaryModule } from '@scwar/nestjs-cloudinary';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadService } from './upload/upload.service';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [
    RegisterModule,
    AuthModule,
    AuthGoogleModule,
    AuthModule,
    AdminModule,
    RoomsModule,
    ChatModule,
    FriendsModule,
    DirectMessageModule,
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useFactory: async () => ({
    //     store: await redisStore({
    //       socket: {
    //         host: process.env.HOST_REDIS_LOCAL,
    //         port: Number(process.env.PORT_REDIS),
    //       },
    //       password: process.env.PASS_REDIS,
    //       ttl: 600,
    //     }),
    //   }),
    // }),
    CloudinaryModule.forRoot({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      
    }),
    EmailServiceModule, OtpModule, SettingsModule,
    // EmailServiceModule,
  ],
  controllers: [AppController, SettingsController, UploadController],
  providers: [
    AppService,
    RedisService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuardGlobal,
    },
    SettingsService,
    UploadService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(
    //     RequestIdMiddleware,
    //     SecurityHeadersMiddleware,
    //     ErrorHandlingMiddleware,
    //     LoggerMiddleware,
    //     RateLimitMiddleware,
    //     SanitizationMiddleware,
    //   )
    //   .forRoutes({
    //     path: '*',
    //     method: RequestMethod.ALL,
    //   });
  }
}
