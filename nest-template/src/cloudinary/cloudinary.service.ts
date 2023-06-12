import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  private EXPIRATION = isNaN(parseInt(process.env.EXPIRATION))
    ? 10000
    : parseInt(process.env.EXPIRATION);

  public cloudinaryBaseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/`;

  publicImageUrl(assetId: string) {
    return `${this.cloudinaryBaseUrl}${assetId}`;
  }

  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  generatePresignedUrl(assetId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.explicit(
        assetId,
        {
          type: 'upload',
          resource_type: 'image',
          expiration: Math.round(Date.now() / 1000) + this.EXPIRATION,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      );
    });
  }
}
