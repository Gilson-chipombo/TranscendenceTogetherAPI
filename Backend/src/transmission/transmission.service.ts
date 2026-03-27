import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartTransmissionDto } from './dto/start-transmission.dto';
import { BroadcastControlDto } from './dto/broadcast-control.dto';

interface ActiveTransmission {
  roomId: string;
  ownerId: string;
  isLive: boolean;
  startedAt: Date;
}

@Injectable()
export class TransmissionService {
  private readonly logger = new Logger(TransmissionService.name);

  // Map to track active transmissions: roomId -> transmission data
  private activeTransmissions = new Map<string, ActiveTransmission>();

  constructor(private prisma: PrismaService) {}

  /**
   * Start a transmission in a room
   * @param startTransmissionDto Room ID
   * @param userId ID of the user starting transmission (must be room owner)
   * @returns Transmission data
   */
  async startTransmission(
    startTransmissionDto: StartTransmissionDto,
    userId: string,
  ): Promise<ActiveTransmission> {
    const { roomId } = startTransmissionDto;

    try {
      // Validate room exists
      const room = await this.prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        throw new NotFoundException(`Room ${roomId} not found`);
      }

      // Verify user is the room owner
      if (room.hostId !== userId) {
        throw new BadRequestException('Only room owner can start transmission');
      }

      // Check if transmission already active in this room
      if (this.activeTransmissions.has(roomId)) {
        throw new BadRequestException('Transmission already active in this room');
      }

      const transmission: ActiveTransmission = {
        roomId,
        ownerId: userId,
        isLive: true,
        startedAt: new Date(),
      };

      this.activeTransmissions.set(roomId, transmission);
      this.logger.debug(`Transmission started in room ${roomId} by owner ${userId}`);

      return transmission;
    } catch (error) {
      this.logger.error(`Error starting transmission: ${error.message}`);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to start transmission');
    }
  }

  /**
   * Stop a transmission in a room
   * @param roomId Room ID
   * @param userId ID of the user stopping transmission (must be owner)
   */
  async stopTransmission(roomId: string, userId: string): Promise<void> {
    try {
      const transmission = this.activeTransmissions.get(roomId);

      if (!transmission) {
        throw new NotFoundException('No active transmission in this room');
      }

      // Verify user is the owner
      if (transmission.ownerId !== userId) {
        throw new BadRequestException('Only transmission owner can stop it');
      }

      this.activeTransmissions.delete(roomId);
      this.logger.debug(`Transmission stopped in room ${roomId}`);
    } catch (error) {
      this.logger.error(`Error stopping transmission: ${error.message}`);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to stop transmission');
    }
  }

  /**
   * Validate and process broadcast control
   * @param broadcastControlDto Control data
   * @param userId ID of the user sending control (must be owner)
   */
  async validateBroadcastControl(
    broadcastControlDto: BroadcastControlDto,
    userId: string,
  ): Promise<BroadcastControlDto> {
    const { roomId, action, timestamp } = broadcastControlDto;

    try {
      const transmission = this.activeTransmissions.get(roomId);

      if (!transmission) {
        throw new NotFoundException('No active transmission in this room');
      }

      // Only owner can broadcast controls
      if (transmission.ownerId !== userId) {
        throw new BadRequestException('Only transmission owner can control playback');
      }

      // If seek action, timestamp is required
      if (action === 'seek' && (timestamp === undefined || timestamp === null)) {
        throw new BadRequestException('Timestamp required for seek action');
      }

      this.logger.debug(
        `Broadcast control in room ${roomId}: ${action}${timestamp ? ` @ ${timestamp}ms` : ''}`,
      );

      return broadcastControlDto;
    } catch (error) {
      this.logger.error(`Error validating broadcast control: ${error.message}`);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to validate broadcast control');
    }
  }

  /**
   * Check if transmission is active in a room
   * @param roomId Room ID
   * @returns Transmission data or null
   */
  getActiveTransmission(roomId: string): ActiveTransmission | null {
    return this.activeTransmissions.get(roomId) || null;
  }

  /**
   * Get all active transmissions (for debugging)
   * @returns Array of active transmissions
   */
  getAllActiveTransmissions(): ActiveTransmission[] {
    return Array.from(this.activeTransmissions.values());
  }

  /**
   * Clean up transmission when room is deleted or user disconnects
   * @param roomId Room ID
   */
  cleanupTransmission(roomId: string): void {
    if (this.activeTransmissions.has(roomId)) {
      this.activeTransmissions.delete(roomId);
      this.logger.debug(`Cleaned up transmission in room ${roomId}`);
    }
  }
}
