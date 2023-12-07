import { registerAs } from '@nestjs/config';
import bytes from 'bytes';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { ENUM_FILE_UPLOAD_TO } from 'src/common/file/constants/file.enum.constant';

// if we use was api gateway, there has limitation of the payload size
// the payload size 10mb
export default registerAs(
    'file',
    (): Record<string, any> => ({
        uploadTo:
            process.env.APP_ENV == ENUM_APP_ENVIRONMENT.PRODUCTION
                ? ENUM_FILE_UPLOAD_TO.S3
                : ENUM_FILE_UPLOAD_TO.LOCAL,
        image: {
            maxFileSize: bytes('1mb'), // 1mb
            maxFiles: 3, // 3 files
        },
        excel: {
            maxFileSize: bytes('5.5mb'), // 5.5mb
            maxFiles: 1, // 1 files
        },
        audio: {
            maxFileSize: bytes('5.5mb'), // 5.5mb
            maxFiles: 1, // 1 files
        },
        video: {
            maxFileSize: bytes('5.5mb'), // 5.5mb
            maxFiles: 1, // 1 files
        },
    }),
);
