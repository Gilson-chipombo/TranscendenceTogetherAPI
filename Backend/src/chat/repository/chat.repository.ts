import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class ChatRepository {
    constructor(private prisma: PrismaService){}

    async saveMessage(data)
    {
        return await this.prisma.message.create({ data })
    }

    async getRoomMessages(roomId: string){
        return await this.prisma.message.findMany({
            where: { roomId },
            orderBy:{
                createdAt: "asc"
            }
        });
    }

}
