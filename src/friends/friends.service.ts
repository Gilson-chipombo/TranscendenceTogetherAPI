import { Injectable, BadRequestException, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FriendsRepository } from './repository/friends.repository';
import { SendFriendRequestDto } from './dto/send-request.dto';
import { RespondFriendRequestDto } from './dto/respond-request.dto';
import { Friendship } from '@prisma/client';

@Injectable()
export class FriendsService {
    private readonly logger = new Logger(FriendsService.name);

    constructor(private repository: FriendsRepository) {}

    /**
     * Send a friend request
     * @param sendFriendRequestDto Friend request data
     * @param requesterId ID of the user sending the request (from JWT)
     * @returns Created friendship record with "pending" status
     */
    async sendRequest(
        sendFriendRequestDto: SendFriendRequestDto,
        requesterId: string
    ): Promise<Friendship> {
        if (!requesterId || typeof requesterId !== 'string') {
            throw new BadRequestException('Requester ID is invalid');
        }

        if (!sendFriendRequestDto || !sendFriendRequestDto.receiverId) {
            throw new BadRequestException('Receiver ID is required');
        }

        // Prevent self-requests
        if (requesterId === sendFriendRequestDto.receiverId) {
            throw new BadRequestException('Cannot send friend request to yourself');
        }

        try {
            this.logger.debug(`User ${requesterId} sending friend request to ${sendFriendRequestDto.receiverId}`);
            const friendship = await this.repository.sendRequest(
                requesterId,
                sendFriendRequestDto.receiverId
            );
            this.logger.debug(`Friend request created: ${friendship.id}`);
            return friendship;
        } catch (error) {
            this.logger.error(`Error sending friend request: ${error.message}`);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to send friend request');
        }
    }

    /**
     * Respond to a friend request
     * @param respondFriendRequestDto Response data with requestId and status
     * @param responderId ID of the user responding (from JWT)
     * @returns Updated friendship record
     */
    async respondRequest(
        respondFriendRequestDto: RespondFriendRequestDto,
        responderId: string
    ): Promise<Friendship> {
        if (!responderId || typeof responderId !== 'string') {
            throw new BadRequestException('Responder ID is invalid');
        }

        if (!respondFriendRequestDto.requestId) {
            throw new BadRequestException('Request ID is required');
        }

        if (!respondFriendRequestDto.status) {
            throw new BadRequestException('Status is required');
        }

        try {
            this.logger.debug(`User ${responderId} responding to friend request ${respondFriendRequestDto.requestId}`);
            const friendship = await this.repository.respondRequest(
                respondFriendRequestDto.requestId,
                respondFriendRequestDto.status,
                responderId
            );
            this.logger.debug(`Friend request ${friendship.id} updated to ${friendship.status}`);
            return friendship;
        } catch (error) {
            this.logger.error(`Error responding to friend request: ${error.message}`);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to respond to friend request');
        }
    }

    /**
     * Get all accepted friends for a user
     * @param userId ID of the user
     * @returns Array of friends with user details
     */
    async getFriends(userId: string): Promise<any[]> {
        if (!userId || typeof userId !== 'string') {
            throw new BadRequestException('User ID is invalid');
        }

        try {
            this.logger.debug(`Fetching friends for user ${userId}`);
            const friends = await this.repository.getFriends(userId);
            this.logger.debug(`Found ${friends.length} friends for user ${userId}`);
            return friends;
        } catch (error) {
            this.logger.error(`Error fetching friends: ${error.message}`);
            throw new InternalServerErrorException('Failed to fetch friends');
        }
    }

    /**
     * Get pending friend requests for a user
     * @param userId ID of the user
     * @returns Array of pending friend requests
     */
    async getPendingRequests(userId: string): Promise<any[]> {
        if (!userId || typeof userId !== 'string') {
            throw new BadRequestException('User ID is invalid');
        }

        try {
            this.logger.debug(`Fetching pending requests for user ${userId}`);
            const requests = await this.repository.getPendingRequests(userId);
            this.logger.debug(`Found ${requests.length} pending requests for user ${userId}`);
            return requests;
        } catch (error) {
            this.logger.error(`Error fetching pending requests: ${error.message}`);
            throw new InternalServerErrorException('Failed to fetch pending requests');
        }
    }

    /**
     * Get user friend statistics
     * @param userId ID of the user
     * @returns Statistics object with counts
     */
    async getStats(userId: string): Promise<{
        totalFriends: number;
        totalBlocked: number;
        totalPending: number;
        totalPublicRooms: number;
        totalPrivateRooms: number;
    }> {
        if (!userId || typeof userId !== 'string') {
            throw new BadRequestException('User ID is invalid');
        }

        try {
            this.logger.debug(`Fetching statistics for user ${userId}`);
            const stats = await this.repository.getStats(userId);
            this.logger.debug(`Statistics fetched for user ${userId}`);
            return stats;
        } catch (error) {
            this.logger.error(`Error fetching statistics: ${error.message}`);
            throw new InternalServerErrorException('Failed to fetch statistics');
        }
    }

    /**
     * Remove a friend (delete friendship)
     * @param friendshipId ID of the friendship to remove
     * @param userId ID of the user requesting removal
     * @returns Deleted friendship record
     */
    async removeFriend(friendshipId: string, userId: string): Promise<Friendship> {
        if (!friendshipId || typeof friendshipId !== 'string') {
            throw new BadRequestException('Friendship ID is invalid');
        }

        if (!userId || typeof userId !== 'string') {
            throw new BadRequestException('User ID is invalid');
        }

        try {
            this.logger.debug(`User ${userId} removing friendship ${friendshipId}`);
            const friendship = await this.repository.removeFriend(friendshipId, userId);
            this.logger.debug(`Friendship ${friendshipId} removed`);
            return friendship;
        } catch (error) {
            this.logger.error(`Error removing friend: ${error.message}`);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to remove friend');
        }
    }
}

