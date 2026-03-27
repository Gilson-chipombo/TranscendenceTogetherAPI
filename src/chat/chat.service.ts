import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from '@prisma/client';

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);

    constructor(private repository: ChatRepository){}

    async sendMessage(data: SendMessageDto): Promise<Message> {
        if (!data.roomId || !data.userId || !data.content) {
            throw new BadRequestException('Missing required fields: roomId, userId, content');
        }

        if (data.content.trim().length === 0) {
            throw new BadRequestException('Message content cannot be empty');
        }

        try {
            const message = await this.repository.saveMessage(data);
            this.logger.debug(`Message created: ${message.id}`);
            return message;
        } catch (error) {
            this.logger.error(`Error saving message: ${error.message}`);
            throw new BadRequestException('Failed to save message');
        }
    }

    async getRoomMessage(roomId: string): Promise<Message[]> {
        if (!roomId || typeof roomId !== 'string') {
            throw new BadRequestException('Invalid room ID');
        }

        try {
            const messages = await this.repository.getRoomMessages(roomId);
            this.logger.debug(`Retrieved ${messages.length} messages for room ${roomId}`);
            return messages;
        } catch (error) {
            this.logger.error(`Error retrieving messages: ${error.message}`);
            throw new BadRequestException('Failed to retrieve messages');
        }
    }
}
