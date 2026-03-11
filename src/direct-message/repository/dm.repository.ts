import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class DmRepository {
    constructor(private prisma: PrismaService){}
    async sendMessage(data) {
        return await this.prisma.directMessage.create({
          data
        });

    }

  async getConversation(user1: string, user2: string) {

    return await this.prisma.directMessage.findMany({
      where: {
        OR: [
          {
            senderId: user1,
            receiverId: user2
          },
          {
            senderId: user2,
            receiverId: user1
          }
        ]
      },
      orderBy: {
        createdAt: "asc"
      }
    });
  }
}
