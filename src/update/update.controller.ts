import { Controller } from '@nestjs/common';
import { Post, Res, Req, Get, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateService } from './update.service';

@Controller('update')
export class UpdateController {
    constructor(private readonly updateService: UpdateService) {}

    @UseInterceptors(FileInterceptor('file'))
    @Post('upload')
    async uploadFile(@UploadedFile() File : Express.Multer.File, @CurrentUser() user: any, @Res({passthrough: true}) res) {
       try{
        const result = await this.updateService.uploadFile(user.id, File);
        res.status(result.status).json(result);
        return result;
       } catch (error) {
            console.error('Error in uploadFile:', error);
            res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
}
