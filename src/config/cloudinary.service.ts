import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

type File = {
  tempFilePath: string;
};

type UploadOptions = {
  height?: number;
  quality?: number;
  resource_type: 'auto' | 'image' | 'video' | 'raw';
  folder: string;
};

export const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    console.log('Cloudinary Connected');
  } catch (error) {
    console.log('Error connecting to Cloudinary');
    console.log(error);
  }
};

@Injectable()
export class CloudinaryService {
  async Uploader(
    file: File,
    folder: string,
    height?: number,
    quality?: number,
  ) {
    const options: UploadOptions = { folder, resource_type: 'auto' };

    if (height) {
      options.height = height;
    }

    if (quality) {
      options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
  }
}
