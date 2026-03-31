import { IsBoolean,IsObject, ValidateNested, IsOptional, IsString} from "class-validator";
import { SwaggerCustomOptions } from "@nestjs/swagger";
import { ColorsDto } from "../interface/config";
import { Type } from "class-transformer";

export const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
        persistAuthorization: true,
    },
    customSiteTitle: 'TOGETHER API Documentation',
    customCss: '.swagger-ui .topbar { background-color: #4A90E2; } .swagger-ui .info { background-color: #F5F5F5; padding: 10px; border-radius: 5px; } .swagger-ui .info h2 { color: #333; } .swagger-ui .info p { color: #666; }',
};

export class SettingsDto{
    @IsBoolean()
    @IsOptional()
        pushNotifications?: boolean;
    @IsBoolean()
    @IsOptional()
        sound?: boolean;
    @IsBoolean()
    @IsOptional()
        privateProfile?: boolean;
    @IsBoolean()
    @IsOptional()
        showStatus?: boolean;
    @IsBoolean()
    @IsOptional()
        autoReprodution?: boolean;
    @IsString()
    @IsOptional()
        language?: string;
    @IsObject()
    @ValidateNested()
    @IsOptional()
    @Type(() => ColorsDto)
        color?: ColorsDto;
}