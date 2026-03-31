import { PrismaService } from "../../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { SettingsDto } from "../dto/settings.dto";

@Injectable()
export class SettingsRepository {
    constructor(private prisma: PrismaService) {}

    async getSettings(userId: string): Promise<any>{
        return await this.prisma.settings.findUnique({
            where: { userId },
        });
    }

    async updateSettings(userId: string, settingsDto: SettingsDto): Promise<any>{
        return await this.prisma.settings.upsert({
            where: { userId },
            update: { 
                sound: settingsDto.sound,
                pushNotifications: settingsDto.pushNotifications,
                privateProfile: settingsDto.privateProfile,
                showStatus: settingsDto.showStatus,
                autoReprodution: settingsDto.autoReprodution,
                language: settingsDto.language,
                color: settingsDto.color ? JSON.stringify(settingsDto.color) : undefined,
             },
            create: {
                userId,
                sound: settingsDto.sound,
                privateProfile: settingsDto.privateProfile,
                showStatus: settingsDto.showStatus,
                autoReprodution: settingsDto.autoReprodution,
                pushNotifications: settingsDto.pushNotifications,
                language: settingsDto.language,
                color: settingsDto.color ? JSON.stringify(settingsDto.color) : undefined,
             },
        });
    }

    async createSettings(userId: string): Promise<any>{
        return await this.prisma.settings.create({
            data: {
                userId,
                sound: true,
                privateProfile: false,
                showStatus: true,
                autoReprodution: false,
                language: 'pt',
                pushNotifications: true,
                color: JSON.stringify({
                    "background": "#131418",
                    "card": "#1F2229",
                    "primary": "#F9A82F",
                    "accent": "#33CC33",
                    "foreground": "#E9F1F2"
                }),
            },
        });
    }
} 