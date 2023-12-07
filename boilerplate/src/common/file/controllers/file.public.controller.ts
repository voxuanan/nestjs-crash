import {
    Controller,
    Post,
    UploadedFile,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplyCircuitBreaker } from 'src/common/circuit-breaker/decorators/circuit-breaker.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { UploadFileSingle } from '../decorators/file.decorator';
import { UploadFilePublicDoc } from '../docs/file.public.doc';
import { FileRequiredPipe } from '../pipes/file.required.pipe';
import { FileSizeImagePipe } from '../pipes/file.size.pipe';
import { FileTypeImagePipe } from '../pipes/file.type.pipe';
import { FileService } from '../services/file.service';
import { FileSharpPipe } from '../pipes/file.sharp.pipe';

@ApiTags('modules.public.file')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/file',
})
export class FilePublicController {
    constructor(private readonly fileService: FileService) {}

    @ApplyCircuitBreaker({
        successThreshold: 10,
        failureThreshold: 10,
        openToHalfOpenWaitTime: 60000,
    })
    @UploadFilePublicDoc()
    @Response('file.upload')
    @Post('upload')
    @UploadFileSingle('file')
    async upload(
        @UploadedFile(
            FileRequiredPipe,
            FileTypeImagePipe,
            new FileSharpPipe(),
            FileSizeImagePipe,
        )
        file: Express.Multer.File,
    ): Promise<IResponse> {
        const result = await this.fileService.uploadFile(file);

        return {
            data: typeof result === 'string' ? file : result,
        };
    }
}
