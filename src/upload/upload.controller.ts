import { Controller, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('upload')
export class UploadController {
    constructor(private readonly upload: UploadService){}
    @UseInterceptors(FileInterceptor('File'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "to upload file",
    })
    async UploadFiles(@UploadedFiles() file: Express.Multer.File){
        return await this.upload.uploadImage(file);
    }


}
