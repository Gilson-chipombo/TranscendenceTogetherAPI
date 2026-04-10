import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { ClaudinaryService } from './claudinary/claudinary.service';
import { UploadRepository } from './repository/upload.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [UpdateService, ClaudinaryService, UploadRepository, PrismaService],
  exports: [ClaudinaryService, UploadRepository, PrismaService],
})
export class UpdateModule {}
