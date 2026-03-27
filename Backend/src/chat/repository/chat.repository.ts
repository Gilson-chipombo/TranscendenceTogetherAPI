import { Injectable, Logger, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SendMessageDto } from "../dto/send-message.dto";
import { Message } from "@prisma/client";

@Injectable()
export class ChatRepository {
    private readonly logger = new Logger(ChatRepository.name);

    constructor(private prisma: PrismaService){}

    async saveMessage(data: SendMessageDto): Promise<Message> {
        try {
            const message = await this.prisma.message.create({
                data: {
                    roomId: data.roomId,
                    userId: data.userId,
                    content: data.content,
                },
            });
            return message;
        } catch (error) {
            this.logger.error(`Database error saving message: ${error.message}`);
            throw new InternalServerErrorException('Failed to save message to database');
        }
    }

    async getRoomMessages(roomId: string): Promise<Message[]> {
        try {
            const messages = await this.prisma.message.findMany({
                where: { roomId },
                orderBy: {
                    createdAt: "asc"
                },
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
            });
            return messages;
        } catch (error) {
            this.logger.error(`Database error retrieving messages: ${error.message}`);
            throw new InternalServerErrorException('Failed to retrieve messages from database');
        }
    }
}
