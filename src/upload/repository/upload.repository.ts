import { PrismaService } from "../../prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UploadRepository {
  constructor(private readonly prisma: PrismaService) {}
  async uploadFile(userId: string, fileUrl: string) {
    try{
        const result  = await this.prisma.user.update({
                where: { id: userId },
                data: { 
                    photo: fileUrl,
                 }
        })
        if (result) {
            return {
                status: 201,
                message: "file uploaded successfully",
                response: result,
            }
        }
        return {
            status: 500,
            message: "can not upload file",
        }
    } catch(error)
    {
        console.error('Error in uploadFile:', error);
        return {
            status: 500,
            message: "Internal server error",
        }
    }
  }

  async uploadFileRoom(roomId: string, fileUrl: string) {
    try{
        const result  = await this.prisma.room.update({
                where: { id: roomId },
                data: { 
                    poster: fileUrl,
                 }
        })
        if (result) {
            return {
                status: 201,
                message: "file uploaded successfully",
                response: result,
            }
        }
        return {
            status: 500,
            message: "can not upload file",
        }
    } catch(error)
    {
        console.error('Error in uploadFileRoom:', error);
        return {
            status: 500,
            message: "Internal server error",
        }
    }
  }
}