import { Injectable, Logger, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Friendship } from '@prisma/client';

@Injectable()
export class FriendsRepository {
    private readonly logger = new Logger(FriendsRepository.name);

    constructor(private prisma: PrismaService) {}

    /**
     * Send a friend request
     * @param requesterId ID of user sending request
     * @param receiverId ID of user receiving request
     * @returns Created friendship record
     */
    async sendRequest(requesterId: string, receiverId: string): Promise<Friendship> {
        try {
            // Check if users exist
            const [requester, receiver] = await Promise.all([
                this.prisma.user.findUnique({ where: { id: requesterId } }),
                this.prisma.user.findUnique({ where: { id: receiverId } }),
            ]);

            if (!requester) {
                throw new NotFoundException(`Requester user ${requesterId} not found`);
            }

            if (!receiver) {
                throw new NotFoundException(`Receiver user ${receiverId} not found`);
            }

            // Check if request already exists
            const existingRequest = await this.prisma.friendship.findFirst({
                where: {
                    OR: [
                        {
                            requesterId: requesterId,
                            receiverId: receiverId,
                        },
                        {
                            requesterId: receiverId,
                            receiverId: requesterId,
                        },
                    ],
                    status: { in: ['pending', 'accepted'] },
                },
            });

            if (existingRequest) {
                throw new BadRequestException(
                    `Friend request or friendship already exists between these users`
                );
            }

            this.logger.debug(`Creating friend request from ${requesterId} to ${receiverId}`);

            const friendship = await this.prisma.friendship.create({
                data: {
                    requesterId,
                    receiverId,
                    status: 'pending',
                    block: false,
                },
            });

            return friendship;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Database error sending friend request: ${error.message}`);
            throw new InternalServerErrorException('Failed to send friend request');
        }
    }

    /**
     * Respond to a friend request
     * @param requestId ID of the friendship record
     * @param status "accepted" or "rejected"
     * @param responderId ID of user responding (must be receiver)
     * @returns Updated friendship record
     */
    async respondRequest(
        requestId: string,
        status: 'accepted' | 'rejected',
        responderId: string
    ): Promise<Friendship> {
        try {
            // Find the friendship request
            const friendship = await this.prisma.friendship.findUnique({
                where: { id: requestId },
            });

            if (!friendship) {
                throw new NotFoundException(`Friend request ${requestId} not found`);
            }

            // Verify responder is the receiver
            if (friendship.receiverId !== responderId) {
                throw new BadRequestException(
                    'Only the receiver can respond to this friend request'
                );
            }

            // Check if already responded
            if (friendship.status !== 'pending') {
                throw new BadRequestException(
                    `This request has already been ${friendship.status}`
                );
            }

            this.logger.debug(`Responding to friend request ${requestId} with status: ${status}`);

            const updated = await this.prisma.friendship.update({
                where: { id: requestId },
                data: { status },
            });

            return updated;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Database error responding to friend request: ${error.message}`);
            throw new InternalServerErrorException('Failed to respond to friend request');
        }
    }

    /**
     * Get all accepted friends for a user
     * @param userId User ID
     * @returns Array of friend objects with friend user details
     */
    async getFriends(userId: string): Promise<any[]> {
        try {
            this.logger.debug(`Fetching friends for user ${userId}`);

            const friendships = await this.prisma.friendship.findMany({
                where: {
                    status: 'accepted',
                    OR: [
                        { requesterId: userId },
                        { receiverId: userId },
                    ],
                },
            });

            // Enrich with friend user data
            const friends = await Promise.all(
                friendships.map(async (friendship) => {
                    const friendId =
                        friendship.requesterId === userId
                            ? friendship.receiverId
                            : friendship.requesterId;

                    const friendUser = await this.prisma.user.findUnique({
                        where: { id: friendId },
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            photo: true,
                            phone: true,
                        },
                    });

                    return {
                        friendshipId: friendship.id,
                        ...friendUser,
                        acceptedAt: friendship.createdAt,
                    };
                })
            );

            return friends;
        } catch (error) {
            this.logger.error(`Database error fetching friends: ${error.message}`);
            throw new InternalServerErrorException('Failed to fetch friends');
        }
    }

    /**
     * Get pending friend requests for a user (where user is receiver)
     * @param userId User ID
     * @returns Array of pending requests with requester details
     */
    async getPendingRequests(userId: string): Promise<any[]> {
        try {
            this.logger.debug(`Fetching pending requests for user ${userId}`);

            const requests = await this.prisma.friendship.findMany({
                where: {
                    receiverId: userId,
                    status: 'pending',
                },
            });

            // Enrich with requester user data
            const enrichedRequests = await Promise.all(
                requests.map(async (request) => {
                    const requester = await this.prisma.user.findUnique({
                        where: { id: request.requesterId },
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            photo: true,
                        },
                    });

                    return {
                        requestId: request.id,
                        requester,
                        requestedAt: request.createdAt,
                    };
                })
            );

            return enrichedRequests;
        } catch (error) {
            this.logger.error(`Database error fetching pending requests: ${error.message}`);
            throw new InternalServerErrorException('Failed to fetch pending requests');
        }
    }

    /**
     * Get user statistics (friends, blocked, pending, rooms)
     * @param userId User ID
     * @returns Object with counts
     */
    async getStats(userId: string): Promise<{
        totalFriends: number;
        totalBlocked: number;
        totalPending: number;
        totalPublicRooms: number;
        totalPrivateRooms: number;
    }> {
        try {
            this.logger.debug(`Fetching statistics for user ${userId}`);

            // Count accepted friends
            const totalFriends = await this.prisma.friendship.count({
                where: {
                    status: 'accepted',
                    block: false,
                    OR: [
                        { requesterId: userId },
                        { receiverId: userId },
                    ],
                },
            });

            // Count blocked friends
            const totalBlocked = await this.prisma.friendship.count({
                where: {
                    status: 'accepted',
                    block: true,
                    OR: [
                        { requesterId: userId },
                        { receiverId: userId },
                    ],
                },
            });

            // Count pending friend requests for this user (as receiver)
            const totalPending = await this.prisma.friendship.count({
                where: {
                    receiverId: userId,
                    status: 'pending',
                },
            });

            // Count public rooms created by user
            const totalPublicRooms = await this.prisma.room.count({
                where: {
                    hostId: userId,
                    isPrivate: false,
                },
            });

            // Count private rooms created by user
            const totalPrivateRooms = await this.prisma.room.count({
                where: {
                    hostId: userId,
                    isPrivate: true,
                },
            });

            return {
                totalFriends,
                totalBlocked,
                totalPending,
                totalPublicRooms,
                totalPrivateRooms,
            };
        } catch (error) {
            this.logger.error(`Database error fetching statistics: ${error.message}`);
            throw new InternalServerErrorException('Failed to fetch statistics');
        }
    }

    /**
     * Remove a friend (delete friendship)
     * @param friendshipId ID of the friendship
     * @param userId ID of user performing deletion (must be part of friendship)
     * @returns Deleted friendship record
     */
    async removeFriend(friendshipId: string, userId: string): Promise<Friendship> {
        try {
            const friendship = await this.prisma.friendship.findUnique({
                where: { id: friendshipId },
            });

            if (!friendship) {
                throw new NotFoundException(`Friendship ${friendshipId} not found`);
            }

            // Verify user is part of the friendship
            if (
                friendship.requesterId !== userId &&
                friendship.receiverId !== userId
            ) {
                throw new BadRequestException(
                    'You cannot remove a friendship you are not part of'
                );
            }

            this.logger.debug(`Deleting friendship ${friendshipId}`);

            const deleted = await this.prisma.friendship.delete({
                where: { id: friendshipId },
            });

            return deleted;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Database error removing friend: ${error.message}`);
            throw new InternalServerErrorException('Failed to remove friend');
        }
    }
}

