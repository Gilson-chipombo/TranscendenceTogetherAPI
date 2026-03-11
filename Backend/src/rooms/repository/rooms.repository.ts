import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
//import { PrismaService } from "prisma/prisma.service";
import { PrismaService } from "../../prisma/prisma.service";


@Injectable()
export class RoomsRepository {
    constructor(private prisma: PrismaService){}

    async create(data){
        return this.prisma.room.create({
            data: {
                ...data,
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
