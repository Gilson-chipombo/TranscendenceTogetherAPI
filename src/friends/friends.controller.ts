import { Body, Controller, Get, Param, Post, Delete, BadRequestException, Logger, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { RespondFriendRequestDto } from './dto/respond-request.dto';
import { SendFriendRequestDto } from './dto/send-request.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { Friendship } from '@prisma/client';

@ApiBearerAuth('access_token')
@ApiTags('Friends')
@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
    private readonly logger = new Logger(FriendsController.name);

    constructor(private service: FriendsService) {}

    @ApiOperation({
        summary: 'Send a friend request',
        description: 'Send a friend request to another user. The authenticated user is the requester.',
    })
    @ApiBody({ type: SendFriendRequestDto })
    @ApiResponse({
        status: 201,
        description: 'Friend request sent successfully',
        schema: {
            example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                requesterId: 'user-123',
                receiverId: 'user-456',
                status: 'pending',
                block: false,
                createdAt: '2026-03-27T10:30:45.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - invalid data or self-request',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token required',
    })
    @Post('request')
    async sendRequest(
        @Body() dto: SendFriendRequestDto,
        @CurrentUser() user: any
    ): Promise<Friendship> {
        if (!user || !user.id) {
            throw new BadRequestException('User not authenticated');
        }

        try {
            this.logger.debug(`User ${user.id} sending friend request to ${dto.receiverId}`);
            return await this.service.sendRequest(dto, user.id);
        } catch (error) {
            this.logger.error(`Error sending friend request: ${error.message}`);
            throw error;
        }
    }

    @ApiOperation({
        summary: 'Respond to a friend request',
        description: 'Accept or reject a pending friend request. Only the receiver can respond.',
    })
    @ApiBody({ type: RespondFriendRequestDto })
    @ApiResponse({
        status: 200,
        description: 'Friend request responded successfully',
        schema: {
            example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                requesterId: 'user-123',
                receiverId: 'user-456',
                status: 'accepted',
                block: false,
                createdAt: '2026-03-27T10:30:45.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - invalid data or no permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Friend request not found',
    })
    @Post('respond')
    async respondRequest(
        @Body() dto: RespondFriendRequestDto,
        @CurrentUser() user: any
    ): Promise<Friendship> {
        if (!user || !user.id) {
            throw new BadRequestException('User not authenticated');
        }

        try {
            this.logger.debug(`User ${user.id} responding to friend request ${dto.requestId}`);
            return await this.service.respondRequest(dto, user.id);
        } catch (error) {
            this.logger.error(`Error responding to friend request: ${error.message}`);
            throw error;
        }
    }

    @ApiOperation({
        summary: 'Get all friends',
        description: 'Retrieve a list of all accepted friends (friendships with status "accepted").',
    })
    @ApiResponse({
        status: 200,
        description: 'Friends retrieved successfully',
        schema: {
            example: [
                {
                    friendshipId: '550e8400-e29b-41d4-a716-446655440000',
                    id: 'user-456',
                    name: 'Maria',
                    email: 'maria@example.com',
                    photo: 'https://example.com/photo.jpg',
                    phone: '+351912345678',
                    acceptedAt: '2026-03-20T10:30:45.000Z',
                },
            ],
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token required',
    })
    @Get()
    async getFriends(@CurrentUser() user: any): Promise<any[]> {
        if (!user || !user.id) {
            throw new BadRequestException('User not authenticated');
        }

        try {
            this.logger.debug(`Fetching friends for user ${user.id}`);
            return await this.service.getFriends(user.id);
        } catch (error) {
            this.logger.error(`Error fetching friends: ${error.message}`);
            throw error;
        }
    }

    @ApiOperation({
        summary: 'Get pending friend requests',
        description: 'Retrieve all pending friend requests received by the authenticated user.',
    })
    @ApiResponse({
        status: 200,
        description: 'Pending requests retrieved successfully',
        schema: {
            example: [
                {
                    requestId: '550e8400-e29b-41d4-a716-446655440000',
                    requester: {
                        id: 'user-123',
                        name: 'João',
                        email: 'joao@example.com',
                        photo: 'https://example.com/photo.jpg',
                    },
                    requestedAt: '2026-03-27T10:30:45.000Z',
                },
            ],
        },
    })
    @Get('requests/pending')
    async getPendingRequests(@CurrentUser() user: any): Promise<any[]> {
        if (!user || !user.id) {
            throw new BadRequestException('User not authenticated');
        }

        try {
            this.logger.debug(`Fetching pending requests for user ${user.id}`);
            return await this.service.getPendingRequests(user.id);
        } catch (error) {
            this.logger.error(`Error fetching pending requests: ${error.message}`);
            throw error;
        }
    }

    @ApiOperation({
        summary: 'Remove a friend',
        description: 'Remove a friend (delete a friendship). Either party can remove the friendship.',
    })
    @ApiParam({
        name: 'friendshipId',
        description: 'ID of the friendship to remove',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Friend removed successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - no permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Friendship not found',
    })
    @Delete(':friendshipId')
    async removeFriend(
        @Param('friendshipId') friendshipId: string,
        @CurrentUser() user: any
    ): Promise<Friendship> {
        if (!user || !user.id) {
            throw new BadRequestException('User not authenticated');
        }

        if (!friendshipId || typeof friendshipId !== 'string') {
            throw new BadRequestException('Invalid friendship ID');
        }

        try {
            this.logger.debug(`User ${user.id} removing friendship ${friendshipId}`);
            return await this.service.removeFriend(friendshipId, user.id);
        } catch (error) {
            this.logger.error(`Error removing friend: ${error.message}`);
            throw error;
        }
    }
}

