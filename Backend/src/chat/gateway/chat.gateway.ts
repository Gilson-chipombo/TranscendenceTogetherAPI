import {    
    ConnectedSocket, 
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from "@nestjs/websockets";
import { ChatService } from "../chat.service";
import { Server, Socket } from "socket.io";
import { SendMessageDto } from "../dto/send-message.dto";
import { Logger, UseFilters } from "@nestjs/common";
import { WsExceptionFilter } from "./ws-exception.filter";

@UseFilters(WsExceptionFilter)
@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        credentials: true,
    }
})
export class ChatGateway {
    private readonly logger = new Logger(ChatGateway.name);
    
    @WebSocketServer()
    server: Server;
    
    constructor(private chatService: ChatService){}

    @SubscribeMessage("join-room")
    handleJoinRoom(
        @MessageBody() roomId: string,
        @ConnectedSocket() client: Socket
    ): void {
        if (!roomId || typeof roomId !== "string") {
            throw new WsException("Invalid room ID");
        }
        client.join(roomId);
        this.logger.debug(`Client ${client.id} joined room ${roomId}`);
    }

    @SubscribeMessage("send-message")
    async handleMessage(
        @MessageBody() data: SendMessageDto,
        @ConnectedSocket() client: Socket
    ): Promise<void> {
        try {
            if (!data || !data.roomId || !data.userId || !data.content) {
                throw new WsException("Missing required message fields");
            }

            const message = await this.chatService.sendMessage(data);
            this.server.to(data.roomId).emit("receive-message", message);
            this.logger.debug(`Message sent in room ${data.roomId}`);
        } catch (error) {
            this.logger.error(`Error sending message: ${error.message}`);
            throw new WsException("Failed to send message");
        }
    }
}
