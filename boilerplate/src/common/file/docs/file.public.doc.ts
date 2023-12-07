import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocRequestFile,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';

export function UploadFilePublicDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.public.file',
        }),
        DocRequestFile(),
        DocResponse('file.upload'),
    );
}
