import {    
    ConnectedSocket, 
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { ChatService } from "../chat.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*"   
    }
})

export class ChatGateway {
    
    @WebSocketServer()
    server: Server;
    
    constructor(private chatService: ChatService){}

    @SubscribeMessage("join-romm")
    handleJoinRoom(
        @MessageBody() roomId: string,
        @ConnectedSocket() client: Socket
    ){
        client.join(roomId)
    }

    @SubscribeMessage("send-message")
    async handleMessage(
        @MessageBody() data,
        @ConnectedSocket() client: Socket
    ){
        const message = await this.chatService.sendMessage(data)
        this.server.to(data.roomId).emit("receive-message", message);
    }
}
