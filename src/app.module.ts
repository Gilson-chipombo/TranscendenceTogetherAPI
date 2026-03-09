import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './users/user.module';
import { RoomsModule } from './rooms/rooms.module';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AdminModule,
    RoomsModule,
    ChatModule,
    FriendsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
