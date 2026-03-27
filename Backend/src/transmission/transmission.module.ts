import { Module } from '@nestjs/common';
import { TransmissionService } from './transmission.service';
import { TransmissionGateway } from './transmission.gateway';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Transmission Module
 *
 * Handles real-time screen sharing control synchronization within rooms.
 * Manages WebSocket events for starting, controlling, and stopping transmissions.
 *
 * Features:
 * - Owner-based transmission control
 * - Real-time broadcast control synchronization (play, pause, seek)
 * - Automatic cleanup on disconnect
 * - Stateless design with temporary active transmission tracking
 *
 * WebSocket Events:
 * - start-transmission: Initiate screen sharing in a room
 * - broadcast-control: Send control commands (play, pause, seek)
 * - stop-transmission: End transmission in a room
 * - get-transmission-status: Query current transmission status
 */
@Module({
  providers: [TransmissionService, TransmissionGateway, PrismaService],
  exports: [TransmissionService],
})
export class TransmissionModule {}
