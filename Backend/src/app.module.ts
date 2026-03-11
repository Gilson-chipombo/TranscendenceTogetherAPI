import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { RegisterModule } from './register/register.module';
import { AuthModule } from './auth/auth.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { JwtAuthGuardGlobal } from './auth/guards/jwt-auth-global.guard';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './users/user.module';
import { RoomsModule } from './rooms/rooms.module';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';
import { DirectMessageModule } from './direct-message/direct-message.module';

import {
  LoggerMiddleware,
  SanitizationMiddleware,
  SecurityHeadersMiddleware,
  RateLimitMiddleware,
  ErrorHandlingMiddleware,
  RequestIdMiddleware,
} from './middlewares';

@Module({
  imports: [
    RegisterModule,
    AuthModule,
    AuthGoogleModule,
    AuthModule,
    UserModule,
    AdminModule,
    RoomsModule,
    ChatModule,
    FriendsModule,
    DirectMessageModule
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
    // All middleware disabled
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
