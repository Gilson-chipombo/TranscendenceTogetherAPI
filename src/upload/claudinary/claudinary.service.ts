import { v2 as cloudinary } from "cloudinary";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ClaudinaryService {
  async uploadImage(file: any): Promise<string> {
    const base64Image = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64Image}`;

    try {
      if (process.env.CLOUDINARY_URL) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "uploads",
          resource_type: "auto",
          overwrite: true,
        });

        return result.secure_url;
      }

      throw new Error("Cloudinary not configured");
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new Error("Failed to upload image");
    }
  }
}