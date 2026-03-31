import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsRepository } from './repository/settings.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [],
    controllers: [],
    providers: [SettingsService, SettingsRepository, PrismaService],
    exports: [SettingsRepository],
})
export class SettingsModule {}
