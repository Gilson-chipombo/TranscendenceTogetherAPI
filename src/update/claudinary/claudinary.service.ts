import { v2 as upload } from "cloudinary";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ClaudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
      const var_envCloudFlare = process.env.CLOUDINARY_URL;
      const base64Image = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64Image}`;
    try {
        if (var_envCloudFlare){
            upload.config({claudinary_url: process.env.CLOUDINARY_URL});
            const result = await upload.uploader.upload(dataUri, {
                folder: "together",
                resource_type: "auto",
                overwrite: true,
                public_id: "base64_image"
            });
            return result.secure_url;
        }
        
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new Error("Failed to upload image");
    }
  }
}

