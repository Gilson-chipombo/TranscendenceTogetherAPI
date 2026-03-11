import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { DirectMessageService } from "../direct-message.service";


@WebSocketGateway({
    cors: { origin: "*"}
})

export class DmGateway {
    @WebSocketServer()
    server: Server;

    constructor(private dmService: DirectMessageService){}

    @SubscribeMessage("send-dm")
    async handleDm(@MessageBody() data){
        
        const message = await this.dmService.sendMassage(data);

        this.server.to(data.receiverId).emit(
            "reciver-dm",
            message
        );
    }
}