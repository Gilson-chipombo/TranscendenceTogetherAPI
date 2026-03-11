import { Injectable } from "@nestjs/common";
//import { PrismaService } from "prisma/prisma.service";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService){}

    async create(data: any) {
        
        data.password = await bcrypt.hash(data.password, 10);
        return await this.prisma.user.create({ data });
        
    }

    async findByEmail(email: string) {
       return  await this.prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id: string) {
        return await this.prisma.user.findUnique({
            where: { id }
        });
    }

    async findAll() {
        return await this.prisma.user.findMany({ omit:{password: true}});
    }
}
