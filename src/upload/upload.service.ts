import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '@scwar/nestjs-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResponse } from '@scwar/nestjs-cloudinary';

@Injectable()
export class UploadService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async uploadImage(file: Express.Multer.File): Promise<CloudinaryUploadResponse> {
        try{
             return await this.cloudinaryService.upload(file.path);
        }
        catch(error)
        {
            throw error;
        }
    }
}
