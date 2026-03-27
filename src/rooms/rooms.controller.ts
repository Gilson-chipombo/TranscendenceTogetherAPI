import { Body, Controller, Get, Param, Post, BadRequestException, Logger, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Room } from '@prisma/client';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth('access_token')
@ApiTags('Rooms')
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
    private readonly logger = new Logger(RoomsController.name);

    constructor(private readonly roomsService: RoomsService){}

    @ApiOperation({
        summary: 'Create a new room',
        description: 'Create a new chat room. The authenticated user becomes the room owner. Returns room data including a unique invite token.',
    })
    @ApiBody({ type: CreateRoomDto })
    @ApiResponse({
        status: 201,
        description: 'Room successfully created',
        schema: {
            example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'General Chat',
                hostId: 'user-123',
                inviteToken: '123e4567-e89b-12d3-a456-426614174000',
                createdAt: '2026-03-27T10:30:45.000Z',
                host: {
                    id: 'user-123',
                    name: 'João',
                    email: 'joao@example.com',
                    photo: 'https://example.com/photo.jpg',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - invalid room name',
        schema: {
            example: {
                statusCode: 400,
                message: 'Room name cannot exceed 50 characters',
                error: 'Bad Request',
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token required',
    })
    @Post()
    async create(
        @Body() dto: CreateRoomDto,
        @CurrentUser() user: any
    ): Promise<Room> {
        if (!user || !user.id) {
            throw new BadRequestException('User not authenticated');
        }

        try {
            this.logger.debug(`Creating room: ${dto.name} for user ${user.id}`);
            const room = await this.roomsService.createRoom(dto, user.id);
            this.logger.debug(`Room created: ${room.id}`);
            return room;
        } catch (error) {
            this.logger.error(`Error creating room: ${error.message}`);
            throw error;
        }
    }

    @ApiOperation({
        summary: 'Get room details by invite token',
        description: 'Retrieve information about a room using its invite token, including the last 10 messages.',
    })
    @ApiParam({
        name: 'token',
        description: 'The unique invite token (UUID) for the room',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Room details retrieved successfully',
        schema: {
            example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'General Chat',
                hostId: 'user-123',
                inviteToken: '123e4567-e89b-12d3-a456-426614174000',
                createdAt: '2026-03-27T10:30:45.000Z',
                host: {
                    id: 'user-123',
                    name: 'João',
                    email: 'joao@example.com',
                    photo: 'https://example.com/photo.jpg',
                },
                messages: [],
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid or expired invite token',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token required',
    })
    @Get('invite/:token')
    async findByInvite(@Param('token') token: string): Promise<Room> {
        if (!token || typeof token !== 'string') {
            throw new BadRequestException('Invalid invite token format');
        }

        try {
            this.logger.debug(`Looking up room by invite token: ${token}`);
            const room = await this.roomsService.findByInvite(token);
            
            if (!room) {
                throw new BadRequestException('Invalid or expired invite token');
            }

            return room;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error finding room by invite: ${error.message}`);
            throw new BadRequestException('Failed to find room');
        }
    }

    @ApiOperation({
        summary: 'Join a room using invite token',
        description: 'Join an existing room using the invite token. User cannot join their own room.',
    })
    @ApiParam({
        name: 'token',
        description: 'The unique invite token (UUID) for the room',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @ApiResponse({
        status: 201,
        description: 'Successfully joined the room',
        schema: {
            example: {
                room: {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'General Chat',
                    hostId: 'user-123',
                    inviteToken: '123e4567-e89b-12d3-a456-426614174000',
                    createdAt: '2026-03-27T10:30:45.000Z',
                },
                message: 'Successfully joined room: General Chat',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - cannot join own room or invalid token',
        schema: {
            example: {
                statusCode: 400,
                message: 'You cannot join your own room',
                error: 'Bad Request',
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token required',
    })
    @Post('join/:token')
    async joinRoom(
        @Param('token') token: string,
        @CurrentUser() user: any
    ): Promise<{ room: Room; message: string }> {
        if (!token || typeof token !== 'string') {
            throw new BadRequestException('Invalid invite token format');
        }

        if (!user || !user.id) {
            throw new BadRequestException('User not authenticated');
        }

        try {
            this.logger.debug(`User ${user.id} joining room with token: ${token}`);
            const room = await this.roomsService.joinRoomByInvite(token, user.id);
            this.logger.debug(`User ${user.id} joined room ${room.id}`);
            
            return {
                room,
                message: `Successfully joined room: ${room.name}`
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error joining room: ${error.message}`);
            throw new BadRequestException('Failed to join room');
        }
    }

    @ApiOperation({
        summary: 'Get all rooms created by current user',
        description: 'Retrieve a list of all rooms (chat rooms or spaces) created by the authenticated user.',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved user rooms',
        schema: {
            example: [
                {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'General Chat',
                    hostId: 'user-123',
                    inviteToken: '123e4567-e89b-12d3-a456-426614174000',
                    createdAt: '2026-03-27T10:30:45.000Z',
                    host: {
                        id: 'user-123',
                        name: 'João',
                        email: 'joao@example.com',
                        photo: 'https://example.com/photo.jpg',
                    },
                    messages: [],
                },
            ],
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token required',
    })
    @Get('myrooms')
    async getMyRooms(@CurrentUser() user: any): Promise<Room[]> {
        if (!user || !user.id) {
            throw new BadRequestException('User not authenticated');
        }

        try {
            this.logger.debug(`Fetching rooms for user ${user.id}`);
            const rooms = await this.roomsService.findRoomsByHost(user.id);
            return rooms;
        } catch (error) {
            this.logger.error(`Error fetching user rooms: ${error.message}`);
            throw new BadRequestException('Failed to fetch rooms');
        }
    }
}
