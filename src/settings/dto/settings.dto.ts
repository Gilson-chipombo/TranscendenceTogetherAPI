import { IsBoolean,IsObject, ValidateNested, IsOptional, IsString} from "class-validator";
import { SwaggerCustomOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
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
    @ApiProperty({ description: 'Indicates if push notifications are enabled', example: true })
    @IsBoolean()
    @IsOptional()
        pushNotifications?: boolean;
    @ApiProperty({ description: 'Indicates if sound is enabled', example: true })
    @IsBoolean()
    @IsOptional()
        sound?: boolean;
    @ApiProperty({ description: 'Indicates if profile is private', example: true })
    @IsBoolean()
    @IsOptional()
        privateProfile?: boolean;
    @ApiProperty({ description: 'Indicates if status is shown', example: true })
    @IsBoolean()
    @IsOptional()
        showStatus?: boolean;
    @ApiProperty({ description: 'Indicates if auto-play is enabled', example: true })
    @IsBoolean()
    @IsOptional()
        autoReprodution?: boolean;
    @IsString()
    @IsOptional()
        language?: string;
    @ApiProperty({ 
            description: 'User interface color settings',
            example: {
                card: '#4A90E2',
                primary: '#F5F5F5',
                accent: '#FFFFFF',
                text: '#333333',
                background: '#333333',
                foreground: '#333333',
            }
         }
    )
    @IsObject()
    @ValidateNested()
    @IsOptional()
    @Type(() => ColorsDto)
        color?: ColorsDto;
}