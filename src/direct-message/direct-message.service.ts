import { Injectable, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { DmRepository } from './repository/dm.repository';
import { SendDmDto } from './dto/send-dm.dto';
import { DirectMessage } from '@prisma/client';

@Injectable()
export class DirectMessageService {
  private readonly logger = new Logger(DirectMessageService.name);

  constructor(private repository: DmRepository) {}

  /**
   * Send a direct message
   * @param sendDmDto Message data
   * @param senderId ID of the user sending the message (from JWT)
   * @returns Created direct message
   */
  async sendMessage(sendDmDto: SendDmDto, senderId: string): Promise<DirectMessage> {
    if (!senderId || typeof senderId !== 'string') {
      throw new BadRequestException('Sender ID is invalid');
    }

    if (!sendDmDto || !sendDmDto.receiverId) {
      throw new BadRequestException('Receiver ID is required');
    }

    if (!sendDmDto.content) {
      throw new BadRequestException('Message content is required');
    }

    // Prevent sending to self
    if (senderId === sendDmDto.receiverId) {
      throw new BadRequestException('Cannot send messages to yourself');
    }

    try {
      this.logger.debug(`Sending message from ${senderId} to ${sendDmDto.receiverId}`);
      const message = await this.repository.sendMessage({
        senderId,
        receiverId: sendDmDto.receiverId,
        content: sendDmDto.content.trim(),
      });
      this.logger.debug(`Message sent: ${message.id}`);
      return message;
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to send message');
    }
  }

  /**
   * Get all messages in a conversation
   * @param userId ID of the first user
   * @param receiverId ID of the second user
   * @returns Array of messages ordered by creation time
   */
  async getConversation(userId: string, receiverId: string): Promise<DirectMessage[]> {
    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('User ID is invalid');
    }

    if (!receiverId || typeof receiverId !== 'string') {
      throw new BadRequestException('Receiver ID is invalid');
    }

    try {
      this.logger.debug(`Fetching conversation between ${userId} and ${receiverId}`);
      const messages = await this.repository.getConversation(userId, receiverId);
      this.logger.debug(`Found ${messages.length} messages in conversation`);
      return messages;
    } catch (error) {
      this.logger.error(`Error fetching conversation: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch conversation');
    }
  }
}

