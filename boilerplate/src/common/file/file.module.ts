import { Global, Module } from '@nestjs/common';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { AwsModule } from '../aws/aws.module';
import { FileService } from './services/file.service';
import { UserModule } from 'src/modules/user/user.module';

@Global()
@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory: () => ({
                storage: diskStorage({
                    destination: './data/upload',
                    filename: (req, file, cb) => {
                        const filename: string =
                            path
                                .parse(file.originalname)
                                .name.replace(/\s/g, '') + uuid();
                        const extension: string = path.parse(
                            file.originalname,
                        ).ext;

                        cb(null, `${filename}${extension}`);
                    },
                }),
            }),
        }),
        AwsModule,
        UserModule,
    ],
    providers: [FileService],
    exports: [MulterModule, FileService],
})
export class FileModule {}
