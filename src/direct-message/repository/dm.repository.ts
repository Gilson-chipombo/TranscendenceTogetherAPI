import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DirectMessage } from '@prisma/client';

@Injectable()
export class DmRepository {
  private readonly logger = new Logger(DmRepository.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Send a direct message
   * @param data Message data with senderId, receiverId, and content
   * @returns Created direct message
   */
  async sendMessage(data: {
    senderId: string;
    receiverId: string;
    content: string;
  }): Promise<DirectMessage> {
    try {
      // Validate that both users exist
      const [sender, receiver] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: data.senderId } }),
        this.prisma.user.findUnique({ where: { id: data.receiverId } }),
      ]);

      if (!sender) {
        throw new BadRequestException(`Sender user ${data.senderId} not found`);
      }

      if (!receiver) {
        throw new BadRequestException(`Receiver user ${data.receiverId} not found`);
      }

      this.logger.debug(
        `Creating direct message from ${data.senderId} to ${data.receiverId}`,
      );

      const message = await this.prisma.directMessage.create({
        data: {
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
        },
      });

      return message;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Database error sending message: ${error.message}`);
      throw new InternalServerErrorException('Failed to send message');
    }
  }

  /**
   * Get all messages in a conversation
   * @param user1 First user ID
   * @param user2 Second user ID
   * @returns Array of messages ordered by creation time
   */
  async getConversation(user1: string, user2: string): Promise<DirectMessage[]> {
    try {
      this.logger.debug(`Fetching conversation between ${user1} and ${user2}`);

      const messages = await this.prisma.directMessage.findMany({
        where: {
          OR: [
            {
              senderId: user1,
              receiverId: user2,
            },
            {
              senderId: user2,
              receiverId: user1,
            },
          ],
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return messages;
    } catch (error) {
      this.logger.error(`Database error fetching conversation: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch conversation');
    }
  }
}

