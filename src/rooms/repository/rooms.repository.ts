import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
//import { PrismaService } from "prisma/prisma.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateRoomDto } from "../dto/create-room.dto";
import { Room } from "@prisma/client";


@Injectable()
export class RoomsRepository {
    constructor(private prisma: PrismaService){}

    async create(data: CreateRoomDto): Promise<Room>{
        return await this.prisma.room.create({
            data: {
                name: data.name,
                title: data.title,
                hostId: data.hostId,
                dataInicio: data.dataInicio,
                isPrivate: data.isPrivate,
                dataTermino: data.dataTermino,
                inviteToken: randomUUID()
            }
        });
    }

    async findByInvite(token: string){
        return this.prisma.room.findUnique({
            where: {inviteToken: token }
        });
    }
}
