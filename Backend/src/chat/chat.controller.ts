import { Controller, Get, Param, BadRequestException, Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from '@prisma/client';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access_token')
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    private readonly logger = new Logger(ChatController.name);

    constructor(private service: ChatService){}

    @ApiOperation({
        summary: 'Retrieve messages from a room',
        description: 'Get all messages from a specific room, ordered chronologically. Requires JWT authentication.',
    })
    @ApiParam({
        name: 'roomId',
        description: 'Unique identifier of the room',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved messages',
        schema: {
            example: [
                {
                    id: 'msg-001',
                    roomId: 'room-123',
                    userId: 'user-456',
                    content: 'Hello everyone!',
                    createdAt: '2026-03-27T10:30:45.000Z',
                    user: {
                        id: 'user-456',
                        name: 'João',
                        email: 'joao@example.com',
                        photo: 'https://example.com/photo.jpg',
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid room ID format',
        schema: {
            example: {
                statusCode: 400,
                message: 'Invalid room ID format',
                error: 'Bad Request',
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token required or invalid',
    })
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
