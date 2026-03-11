import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class FriendsRepository {
    
    constructor(private prisma: PrismaService){}

    async sendRequest(data){
        return await this.prisma.friendship.create({
            data
        });
    }

    async respondRequest(requestId: string, status: string){
        return await this.prisma.friendship.update({
            where: {
                id: requestId
            },
            data: {status}
        });
    }

    async getFriends(userId: string){
        return await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { requesterId: userId },
                    { receiverId: userId }
                ],
                status: "accepted"
            }
        });
    }
}
