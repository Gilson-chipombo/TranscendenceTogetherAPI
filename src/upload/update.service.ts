import { Injectable } from '@nestjs/common';
import { ClaudinaryService } from './claudinary/claudinary.service';
import { UploadRepository } from './repository/upload.repository';

@Injectable()
export class UpdateService {
  constructor(
    private readonly claudinaryService: ClaudinaryService,
    private readonly uploadRepository: UploadRepository
  ) {}

  async uploadFileProfile(userId: string, file: Express.Multer.File) {
    try {
        const data_url = await this.claudinaryService.uploadImage(file);
        const fileUrl = await this.uploadRepository.uploadFile(userId, data_url);
        console.log('File URL:', data_url);
        return {
            status: 201,
            message: "file uploaded successfully",
            response: {
                url:fileUrl,
            }
        }
    } catch (error) {
        console.error('Error in uploadFile:', error);
        return {
            status: 500,
            message: "Internal server error",
        }
    }
  }

  async uploadFileRoom(userId :string, file: Express.Multer.File) {
        try {
        const data_url = await this.claudinaryService.uploadImage(file);
        const fileUrl = await this.uploadRepository.uploadFileRoom(userId, data_url);
        console.log('File URL:', data_url);
        return {
            status: 201,
            message: "file uploaded successfully",
            response: {
                url:fileUrl,
            }
        }
    } catch (error) {
            console.error('Error in uploadFileRoom:', error);
            return {
                status: 500,
                message: "Internal server error",
            }
        }
  }
}
