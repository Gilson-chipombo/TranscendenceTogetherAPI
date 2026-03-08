import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService){}

    async create(data: any) {
        return await this.prisma.user.create({ data });
    }

    async findByEmail(email: string) {
       return this.prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }
}
