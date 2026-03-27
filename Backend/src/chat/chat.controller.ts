import { Controller, Get, Param, BadRequestException, Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from '@prisma/client';

@Controller('chat')
export class ChatController {
    private readonly logger = new Logger(ChatController.name);

    constructor(private service: ChatService){}

    /**
     * Retrieve all messages from a specific room
     * @param roomId - The ID of the room
     * @returns Array of messages sorted by creation date
     */
    @Get('room/:roomId')
    async getMessages(@Param('roomId') roomId: string): Promise<Message[]> {
        if (!roomId || typeof roomId !== 'string') {
            throw new BadRequestException('Invalid room ID format');
        }

        try {
            const messages = await this.service.getRoomMessage(roomId);
            this.logger.debug(`Retrieved ${messages.length} messages for room ${roomId}`);
            return messages;
        } catch (error) {
            this.logger.error(`Error retrieving room messages: ${error.message}`);
            throw error;
        }
    }
}
