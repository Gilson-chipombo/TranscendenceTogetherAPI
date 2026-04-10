import { Controller, Post, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateService } from './update.service';
import {
    UploadFileBodyDto,
    UploadSuccessResponseDto,
    UploadErrorResponseDto,
} from './dto/upload.dto';


@ApiTags('upload')
@ApiBearerAuth()
@Controller('upload')
export class UpdateController {
    constructor(private readonly updateService: UpdateService) {}

    @UseInterceptors(FileInterceptor('file'))
    @Post('profile')
    @ApiOperation({ summary: 'Upload a file to profile' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadFileBodyDto })
    @ApiResponse({
        status: 201,
        description: 'File uploaded successfully',
        type: UploadSuccessResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request', type: UploadErrorResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: UploadErrorResponseDto })
    @ApiResponse({ status: 500, description: 'Internal server error', type: UploadErrorResponseDto })
    async uploadFileProfile(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any, @Res({passthrough: true}) res: any) {
       try{
        const result = await this.updateService.uploadFileProfile(user.id, file);
        // res.status(result.status).json(result);
        return result;
       } catch (error) {
            console.error('Error in uploadFileProfile:', error);
            res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
    
    @UseInterceptors(FileInterceptor('file'))
    @Post('room')
    @ApiOperation({ summary: 'Upload a file to room' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadFileBodyDto })
    @ApiResponse({
        status: 201,
        description: 'File uploaded successfully',
        type: UploadSuccessResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request', type: UploadErrorResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: UploadErrorResponseDto })
    @ApiResponse({ status: 500, description: 'Internal server error', type: UploadErrorResponseDto })
    async uploadFileRoom(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any, @Res({passthrough: true}) res: any) {
        try{
            const result = await this.updateService.uploadFileRoom(user.id, file);
            res.status(result.status).json(result);
            return result;
        } catch (error) {
            console.error('Error in uploadFileRoom:', error);
            res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
}
