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
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.HOST_REDIS,
            port: Number(process.env.PORT_REDIS),
          },
          password: process.env.PASS_REDIS,
          ttl: 600,
        }),
      }),
    }),
    EmailServiceModule,
    // EmailServiceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuardGlobal,
    },
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
