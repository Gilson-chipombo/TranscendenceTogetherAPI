import { Body, Controller, Get, Param, Post, UseGuards, BadRequestException, Logger } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { SendDmDto } from './dto/send-dm.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { DirectMessage } from '@prisma/client';

@ApiBearerAuth('access_token')
@ApiTags('Direct Messages')
@UseGuards(JwtAuthGuard)
@Controller('dm')
export class DirectMessageController {
  private readonly logger = new Logger(DirectMessageController.name);

  constructor(private service: DirectMessageService) {}

  @ApiOperation({
    summary: 'Send a direct message',
    description: 'Send a direct message to another user. The authenticated user is the sender.',
  })
  @ApiBody({ type: SendDmDto })
  @ApiResponse({
    status: 201,
    description: 'Direct message sent successfully',
    schema: {
      example: {
        id: 'clp123abc456',
        senderId: 'user-123',
        receiverId: 'user-456',
        content: 'Hey, how are you?',
        createdAt: '2026-03-27T10:30:45.000Z',
        updatedAt: '2026-03-27T10:30:45.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data or receiver not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @Post()
  async sendMessage(
    @Body() dto: SendDmDto,
    @CurrentUser() user: any
  ): Promise<DirectMessage> {
    if (!user || !user.id) {
      throw new BadRequestException('User not authenticated');
    }

    try {
      this.logger.debug(
        `User ${user.id} sending DM to ${dto.receiverId}: "${dto.content.substring(0, 30)}..."`,
      );
      return await this.service.sendMessage(dto, user.id);
    } catch (error) {
      this.logger.error(`Error sending DM: ${error.message}`);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Get conversation with another user',
    description: 'Retrieve all direct messages between the authenticated user and another user, ordered by creation time.',
  })
  @ApiParam({
    name: 'receiverId',
    description: 'ID of the other user in the conversation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
    schema: {
      example: [
        {
          id: 'clp123abc456',
          senderId: 'user-123',
          receiverId: 'user-456',
          content: 'Hey!',
          createdAt: '2026-03-27T10:00:00.000Z',
          updatedAt: '2026-03-27T10:00:00.000Z',
        },
        {
          id: 'clp123abc457',
          senderId: 'user-456',
          receiverId: 'user-123',
          content: 'Hi there!',
          createdAt: '2026-03-27T10:05:00.000Z',
          updatedAt: '2026-03-27T10:05:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @Get(':receiverId')
  async getConversation(
    @Param('receiverId') receiverId: string,
    @CurrentUser() user: any
  ): Promise<DirectMessage[]> {
    if (!user || !user.id) {
      throw new BadRequestException('User not authenticated');
    }

    if (!receiverId || typeof receiverId !== 'string') {
      throw new BadRequestException('Invalid receiver ID');
    }

    try {
      this.logger.debug(`Fetching conversation between user ${user.id} and ${receiverId}`);
      return await this.service.getConversation(user.id, receiverId);
    } catch (error) {
      this.logger.error(`Error fetching conversation: ${error.message}`);
      throw error;
    }
  }
}

