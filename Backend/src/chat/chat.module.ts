import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './repository/chat.repository';
import { ChatGateway } from './gateway/chat.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ChatService, ChatRepository, ChatGateway, PrismaService],
  controllers: [ChatController]
})
export class ChatModule {}
