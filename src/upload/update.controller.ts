import { Controller } from '@nestjs/common';
import { Post, Res, Req, Get, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateService } from './update.service';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiBody, ApiProperty} from '@nestjs/swagger';


@ApiTags('upload')
@ApiBearerAuth()
@Controller('upload')
export class UpdateController {
    constructor(private readonly updateService: UpdateService) {}

    @UseInterceptors(FileInterceptor('file'))
    @Post('profile')
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiOperation({ summary: 'Upload a file to profile' })
    @ApiBody({ description: 'File to upload' })
    @ApiProperty({ type: 'string', format: 'binary' })
    async uploadFileProfile(@UploadedFile() File : any, @CurrentUser() user: any, @Res({passthrough: true}) res: any) {
       try{
        const result = await this.updateService.uploadFileProfile(user.id, File);
        res.status(result.status).json(result);
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
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiOperation({ summary: 'Upload a file to room' })
    @ApiBody({ description: 'File to upload' })
    @ApiProperty({ type: 'string', format: 'binary' })
    async uploadFileRoom(@UploadedFile() File : any, @CurrentUser() user: any, @Res({passthrough: true}) res: any) {
        try{
            const result = await this.updateService.uploadFileRoom(user.id, File);
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
