import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global() //Isso torna ele global
@Module({
    providers: [PrismaService],
    exports: [PrismaService], // Muito importante
})
export class PrismaModule {}
