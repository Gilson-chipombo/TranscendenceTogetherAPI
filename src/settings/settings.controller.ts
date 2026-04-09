import { Req, Res } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Get, Post, Body, Controller } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { response } from 'express';
import { SettingsDto } from './dto/settings.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settings: SettingsService){}

    @Get()
    async getSettings(@CurrentUser() user: any, @Res({passthrough: true}) req: any){
        const result = await this.settings.getSettings(user.id);
        if (!result)
        {
            const create_settings = await this.settings.createSettings(user.id);
            if (!create_settings){
                return {
                        status: 400,
                        message: "Error in creation of the settings",
                }
            }
            return {
                status: 201,
                message: "settings create sucessfull",
                response: create_settings,
            }
        }
        return {
            status: 200,
            message: "sucess to get settings user",
            response: result,
        }
    }

    // @Public()
    @Post('update-settings')
    async updateSettings(@CurrentUser() user: any, @Body() data: SettingsDto)
    {
        const result = await this.settings.updateSettings(user.id, data);
        if (result){
            return{
                status: 201,
                message: 'update sucessfull',
                response: result,
            }
        }
        return {
            status: 500,
            message: "can not update settings",
        }
    }
}
