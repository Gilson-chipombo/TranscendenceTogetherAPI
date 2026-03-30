import { IsBoolean,IsJSON} from "class-validator";

export class SettingsDto{
    @IsBoolean()
        pushNotifications?: boolean;
        sound?: boolean;
        privateProfile?: boolean;
        showStatus?: boolean;
        autoReprodution?: boolean;
        language?: string;
    @IsJSON()
        color: JSON;
        // userId?: string;
}