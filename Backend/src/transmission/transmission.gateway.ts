import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { UseFilters, Logger, BadRequestException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TransmissionService } from './transmission.service';
import { StartTransmissionDto } from './dto/start-transmission.dto';
import { BroadcastControlDto } from './dto/broadcast-control.dto';
import { WsExceptionFilter } from '../chat/gateway/ws-exception.filter';

@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
})
export class TransmissionGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TransmissionGateway.name);

  constructor(private transmissionService: TransmissionService) {}

  /**
   * Start screen transmission in a room
   * Only the room owner can start transmission
   * @param data StartTransmissionDto with roomId
   * @param client Connected socket
   */
  @SubscribeMessage('start-transmission')
  async handleStartTransmission(
    @MessageBody() data: StartTransmissionDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      if (!data || !data.roomId) {
        throw new BadRequestException('Room ID is required');
      }

      // Extract userId from socket data (should be set during authentication)
      const userId = client.data?.userId;
      if (!userId) {
        throw new BadRequestException('User not authenticated');
      }

      this.logger.debug(`Start transmission request for room ${data.roomId} from user ${userId}`);

      // Start transmission
      const transmission = await this.transmissionService.startTransmission(
        data,
        userId,
      );

      // Join room-specific namespace for transmission events
      const roomId = data.roomId;
      client.join(`transmission:${roomId}`);

      // Broadcast to all members in room that transmission started
      this.server.to(roomId).emit('transmission-started', {
        roomId,
        ownerId: transmission.ownerId,
        startedAt: transmission.startedAt,
      });

      this.logger.debug(`Transmission started in room ${roomId}`);

      // Send confirmation to sender
      client.emit('transmission-status', {
        status: 'started',
        roomId,
      });
    } catch (error) {
      this.logger.error(`Error starting transmission: ${error.message}`);
      client.emit('error', {
        event: 'start-transmission',
        message: error.message || 'Failed to start transmission',
      });
    }
  }

  /**
   * Broadcast control commands (play, pause, seek) to room members
   * Only the transmission owner can send commands
   * @param data BroadcastControlDto with action and optional timestamp
   * @param client Connected socket
   */
  @SubscribeMessage('broadcast-control')
  async handleBroadcastControl(
    @MessageBody() data: BroadcastControlDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      if (!data || !data.roomId || !data.action) {
        throw new BadRequestException('Room ID and action are required');
      }

      // Extract userId from socket data
      const userId = client.data?.userId;
      if (!userId) {
        throw new BadRequestException('User not authenticated');
      }

      this.logger.debug(
        `Broadcast control request in room ${data.roomId}: ${data.action} from user ${userId}`,
      );

      // Validate broadcast control
      const validatedControl = await this.transmissionService.validateBroadcastControl(
        data,
        userId,
      );

      // Broadcast control to all members in room
      const roomId = data.roomId;
      this.server.to(roomId).emit('broadcast-control', {
        action: validatedControl.action,
        timestamp: validatedControl.timestamp,
        sentAt: new Date(),
      });

      this.logger.debug(
        `Control ${validatedControl.action} broadcast to room ${roomId}`,
      );

      // Send confirmation to sender
      client.emit('control-sent', {
        action: validatedControl.action,
        roomId,
      });
    } catch (error) {
      this.logger.error(`Error broadcasting control: ${error.message}`);
      client.emit('error', {
        event: 'broadcast-control',
        message: error.message || 'Failed to broadcast control',
      });
    }
  }

  /**
   * Stop transmission in a room
   * Only the transmission owner can stop it
   * @param data Object with roomId
   * @param client Connected socket
   */
  @SubscribeMessage('stop-transmission')
  async handleStopTransmission(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      if (!data || !data.roomId) {
        throw new BadRequestException('Room ID is required');
      }

      // Extract userId from socket data
      const userId = client.data?.userId;
      if (!userId) {
        throw new BadRequestException('User not authenticated');
      }

      this.logger.debug(`Stop transmission request for room ${data.roomId} from user ${userId}`);

      // Stop transmission
      await this.transmissionService.stopTransmission(data.roomId, userId);

      const roomId = data.roomId;

      // Broadcast to all members in room that transmission stopped
      this.server.to(roomId).emit('transmission-stopped', {
        roomId,
        stoppedAt: new Date(),
      });

      // Leave room-specific namespace
      client.leave(`transmission:${roomId}`);

      this.logger.debug(`Transmission stopped in room ${roomId}`);

      // Send confirmation to sender
      client.emit('transmission-status', {
        status: 'stopped',
        roomId,
      });
    } catch (error) {
      this.logger.error(`Error stopping transmission: ${error.message}`);
      client.emit('error', {
        event: 'stop-transmission',
        message: error.message || 'Failed to stop transmission',
      });
    }
  }

  /**
   * Request current transmission status in a room
   * @param data Object with roomId
   * @param client Connected socket
   */
  @SubscribeMessage('get-transmission-status')
  handleGetTransmissionStatus(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    try {
      if (!data || !data.roomId) {
        throw new BadRequestException('Room ID is required');
      }

      const transmission = this.transmissionService.getActiveTransmission(data.roomId);

      this.logger.debug(`Fetching transmission status for room ${data.roomId}`);

      client.emit('transmission-status', {
        roomId: data.roomId,
        isActive: !!transmission,
        ownerId: transmission?.ownerId || null,
        startedAt: transmission?.startedAt || null,
      });
    } catch (error) {
      this.logger.error(`Error getting transmission status: ${error.message}`);
      client.emit('error', {
        event: 'get-transmission-status',
        message: error.message || 'Failed to get transmission status',
      });
    }
  }

  /**
   * Handle user disconnect - cleanup transmission if they were owner
   * @param client Connected socket
   */
  handleDisconnect(client: Socket): void {
    try {
      const userId = client.data?.userId;
      if (!userId) {
        return;
      }

      this.logger.debug(`User ${userId} disconnected, cleaning up transmissions`);

      // Get all active transmissions and cleanup if this user was the owner
      const activeTransmissions = this.transmissionService.getAllActiveTransmissions();
      for (const transmission of activeTransmissions) {
        if (transmission.ownerId === userId) {
          this.transmissionService.cleanupTransmission(transmission.roomId);
          this.server
            .to(transmission.roomId)
            .emit('transmission-stopped-by-disconnect', {
              roomId: transmission.roomId,
            });
          this.logger.debug(
            `Cleaned up transmission in room ${transmission.roomId} due to owner disconnect`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error in disconnect handler: ${error.message}`);
    }
  }
}
