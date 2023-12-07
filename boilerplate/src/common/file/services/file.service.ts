import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { ENUM_FILE_UPLOAD_TO } from '../constants/file.enum.constant';
import fs from 'fs';
import { promisify } from 'util';

@Injectable()
export class FileService {
    private readonly uploadTo: string;
    constructor(
        private readonly userService: UserService,
        private readonly awsS3Service: AwsS3Service,
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService,
    ) {
        this.uploadTo = this.configService.get<string>('file.uploadTo');
    }

    async uploadFile(
        file: Express.Multer.File,
        user?: UserEntity,
    ): Promise<string | AwsS3Serialization> {
        const filename: string = file.originalname;
        const content: Buffer = file.buffer;
        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toLowerCase();

        if (this.uploadTo == ENUM_FILE_UPLOAD_TO.S3) {
            await promisify(fs.unlink)(file.path);
            if (user) {
                const path = await this.userService.createPhotoFilename();

                const aws: AwsS3Serialization =
                    await this.awsS3Service.putItemInBucket(
                        `${path.filename}.${mime}`,
                        content,
                        {
                            path: `${path.path}/${user.id}`,
                        },
                    );

                return aws;
            } else {
                const newFilename: string = this.helperStringService.random(20);

                const aws: AwsS3Serialization =
                    await this.awsS3Service.putItemInBucket(
                        `${newFilename}.${mime}`,
                        content,
                        {
                            path: `public`,
                        },
                    );
                return aws;
            }
        } else return file.filename;
    }
}
