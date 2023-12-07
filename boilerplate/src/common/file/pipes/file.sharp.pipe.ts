import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import fs from 'fs';
import sharp from 'sharp';
import { promisify } from 'util';
import { IFile } from '../interfaces/file.interface';
import { DEFAULT_SHARP_FILE_SIZE } from '../constants/file.constant';

@Injectable()
export class FileSharpPipe implements PipeTransform {
    private readonly options: number | sharp.ResizeOptions;

    constructor(options?: number | sharp.ResizeOptions) {
        this.options = options || DEFAULT_SHARP_FILE_SIZE;
    }

    async transform(
        value: IFile | IFile[],
        metadata: ArgumentMetadata,
    ): Promise<IFile | IFile[]> {
        if (!value) {
            return;
        }

        if (Array.isArray(value)) {
            const data: IFile[] = [];

            for (const val of value) {
                const file = val as IFile;
                const updated = await this.transformFile(file);
                data.push(updated);
            }

            return data;
        }

        const file = value as IFile;
        value = await this.transformFile(file);

        return value;
    }

    async transformFile(file: IFile): Promise<IFile> {
        const buffer = await promisify(fs.readFile)(file.path);
        const transformedBuffer = await sharp(buffer)
            .resize(this.options)
            .toBuffer();

        const updatedFile: IFile = {
            ...file,
            size: transformedBuffer.length,
        };

        await promisify(fs.writeFile)(updatedFile.path, transformedBuffer);

        return updatedFile;
    }
}
