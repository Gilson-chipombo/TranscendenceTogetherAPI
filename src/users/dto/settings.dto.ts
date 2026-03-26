import { IsBoolean, } from "class-validator";

export class SettingsDto{
    @IsBoolean()
        pushNotifications?: boolean;
        sound?: boolean;
        privateProfile?: boolean;
        showStatus?: boolean;
        autoReprodution?: boolean;
        language?: string;
        // userId?: string;
}