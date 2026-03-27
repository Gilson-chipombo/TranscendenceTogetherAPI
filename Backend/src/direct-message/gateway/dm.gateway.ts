import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { UseFilters, Logger, BadRequestException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DirectMessageService } from '../direct-message.service';
import { SendDmDto } from '../dto/send-dm.dto';
import { WsExceptionFilter } from './ws-exception.filter';

@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
})
export class DmGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DmGateway.name);

  constructor(private dmService: DirectMessageService) {}

  /**
   * Handle direct message send via WebSocket
   * @param data SendDmDto with receiverId and content
   * @param client Connected socket client
   */
  @SubscribeMessage('send-dm')
  async handleDm(
    @MessageBody() data: SendDmDto,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    try {
      if (!data || !data.receiverId || !data.content) {
        throw new BadRequestException('receiverId and content are required');
      }

      // Extract senderId from socket data (should be set during authentication)
      const senderId = client.data?.userId;
      if (!senderId) {
        throw new BadRequestException('User not authenticated');
      }

      this.logger.debug(`WebSocket DM from ${senderId} to ${data.receiverId}`);

      // Send message via service
      const message = await this.dmService.sendMessage(data, senderId);

      // Emit to receiver
      this.server.to(data.receiverId).emit('receiver-dm', message);

      // Emit back to sender for confirmation
      client.emit('dm-sent', { id: message.id, status: 'sent' });

      this.logger.debug(`Message sent successfully: ${message.id}`);
    } catch (error) {
      this.logger.error(`Error handling DM: ${error.message}`);
      client.emit('error', {
        event: 'send-dm',
        message: error.message || 'Failed to send message',
      });
    }
  }
}
