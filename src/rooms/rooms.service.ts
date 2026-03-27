import { Injectable, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { RoomsRepository } from './repository/rooms.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from '@prisma/client';

@Injectable()
export class RoomsService {
    private readonly logger = new Logger(RoomsService.name);

    constructor(private repository: RoomsRepository){}

    /**
     * Create a new room
     * @param createRoomDto Room creation data
     * @param hostId ID of the user creating the room
     * @returns Created room with invite token
     */
    async createRoom(createRoomDto: CreateRoomDto, hostId: string): Promise<Room> {
        if (!createRoomDto) {
            throw new BadRequestException('Room data is required');
        }

        if (!hostId || typeof hostId !== 'string') {
            throw new BadRequestException('Host ID is invalid');
        }

        if (!createRoomDto.name || createRoomDto.name.trim().length === 0) {
            throw new BadRequestException('Room name cannot be empty');
        }

        if (createRoomDto.name.length > 50) {
            throw new BadRequestException('Room name cannot exceed 50 characters');
        }

        try {
            this.logger.debug(`Creating room: ${createRoomDto.name} for host ${hostId}`);
            const room = await this.repository.create(createRoomDto, hostId);
            this.logger.debug(`Room created with ID: ${room.id}`);
            return room;
        } catch (error) {
            this.logger.error(`Error creating room: ${error.message}`);
            throw new InternalServerErrorException('Failed to create room');
        }
    }

    /**
     * Find a room by invite token
     * @param token Invite token
     * @returns Room details if found
     */
    async findByInvite(token: string): Promise<Room> {
        if (!token || typeof token !== 'string' || token.trim().length === 0) {
            throw new BadRequestException('Invalid invite token');
        }

        try {
            this.logger.debug(`Looking up room by invite token`);
            const room = await this.repository.findByInvite(token);
            
            if (!room) {
                throw new BadRequestException('Invalid or expired invite token');
            }

            return room;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error finding room by invite: ${error.message}`);
            throw new InternalServerErrorException('Failed to find room');
        }
    }

    /**
     * Join a room using invite token
     * @param token Invite token
     * @param userId ID of user joining
     * @returns Room details
     */
    async joinRoomByInvite(token: string, userId: string): Promise<Room> {
        if (!token || typeof token !== 'string') {
            throw new BadRequestException('Invalid invite token');
        }

        if (!userId || typeof userId !== 'string') {
            throw new BadRequestException('User ID is invalid');
        }

        try {
            this.logger.debug(`User ${userId} attempting to join room with token`);
            const room = await this.repository.findByInvite(token);
            
            if (!room) {
                throw new BadRequestException('Invalid or expired invite token');
            }

            if (room.hostId === userId) {
                this.logger.warn(`User ${userId} attempted to join their own room`);
                throw new BadRequestException('You cannot join your own room');
            }

            this.logger.debug(`User ${userId} joined room ${room.id}`);
            return room;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error joining room: ${error.message}`);
            throw new InternalServerErrorException('Failed to join room');
        }
    }

    /**
     * Find all rooms created by a specific host
     * @param hostId ID of the room host
     * @returns Array of rooms
     */
    async findRoomsByHost(hostId: string): Promise<Room[]> {
        if (!hostId || typeof hostId !== 'string') {
            throw new BadRequestException('Invalid host ID');
        }

        try {
            this.logger.debug(`Fetching rooms for host ${hostId}`);
            const rooms = await this.repository.findByHostId(hostId);
            return rooms;
        } catch (error) {
            this.logger.error(`Error fetching rooms: ${error.message}`);
            throw new InternalServerErrorException('Failed to fetch rooms');
        }
    }
}
