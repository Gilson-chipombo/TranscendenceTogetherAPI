import { Injectable, Logger, InternalServerErrorException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateRoomDto } from "../dto/create-room.dto";
import { Room } from "@prisma/client";

@Injectable()
export class RoomsRepository {
    private readonly logger = new Logger(RoomsRepository.name);

    constructor(private prisma: PrismaService){}

    /**
     * Create a new room in the database
     * @param data Room creation data
     * @param hostId ID of the user creating the room
     * @returns Created room with generated invite token
     */
    async create(data: CreateRoomDto, hostId: string): Promise<Room> {
        try {
            const inviteToken = randomUUID();
            this.logger.debug(`Creating room: ${data.name} with invite token: ${inviteToken}`);
            
            const room = await this.prisma.room.create({
                data: {
                    name: data.name,
                    hostId: hostId,
                    inviteToken: inviteToken,
                },
                include: {
                    host: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            photo: true,
                        }
                    }
                }
            });
            
            this.logger.debug(`Room created successfully: ${room.id}`);
            return room;
        } catch (error) {
            this.logger.error(`Database error creating room: ${error.message}`);
            throw new InternalServerErrorException('Failed to create room in database');
        }
    }

    /**
     * Find a room by its invite token
     * @param token Invite token
     * @returns Room if found, null otherwise
     */
    async findByInvite(token: string): Promise<Room | null> {
        try {
            this.logger.debug(`Looking up room by invite token`);
            
            const room = await this.prisma.room.findUnique({
                where: { inviteToken: token },
                include: {
                    host: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            photo: true,
                        }
                    },
                    messages: {
                        take: 10,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    photo: true,
                                }
                            }
                        }
                    }
                }
            });
            
            if (room) {
                this.logger.debug(`Room found: ${room.id}`);
            } else {
                this.logger.warn(`Room not found for token`);
            }
            
            return room;
        } catch (error) {
            this.logger.error(`Database error finding room by invite: ${error.message}`);
            throw new InternalServerErrorException('Failed to find room');
        }
    }

    /**
     * Find all rooms created by a specific host
     * @param hostId ID of the room host
     * @returns Array of rooms
     */
    async findByHostId(hostId: string): Promise<Room[]> {
        try {
            this.logger.debug(`Looking up rooms for host: ${hostId}`);
            
            const rooms = await this.prisma.room.findMany({
                where: { hostId: hostId },
                include: {
                    host: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            photo: true,
                        }
                    },
                    messages: {
                        take: 5,
                        orderBy: { createdAt: 'desc' }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            
            this.logger.debug(`Found ${rooms.length} rooms for host`);
            return rooms;
        } catch (error) {
            this.logger.error(`Database error finding rooms by host: ${error.message}`);
            throw new InternalServerErrorException('Failed to find rooms');
        }
    }
}
