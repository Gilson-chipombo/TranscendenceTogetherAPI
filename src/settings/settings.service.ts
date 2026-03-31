import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './repository/settings.repository';
import { SettingsDto } from './dto/settings.dto';
import { retry } from 'rxjs';
@Injectable()
export class SettingsService {
    constructor(private settings: SettingsRepository) {}
    async getSettings(userId: string): Promise<any>{
        return  await this.settings.getSettings(userId);
    }

    async updateSettings(userId: string, settingsDto: SettingsDto): Promise<any>{
        return await this.settings.updateSettings(userId, settingsDto);
    }

    async createSettings(userID: string): Promise<any>{
        const setting_return = await this.getSettings(userID);
        if (!setting_return)
        {
            return await this.settings.createSettings(userID);
        }
        return setting_return;
    }
}
