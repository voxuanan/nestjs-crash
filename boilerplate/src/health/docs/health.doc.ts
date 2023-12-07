import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { HealthSerialization } from 'src/health/serializations/health.serialization';

export function HealthCheckDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'health',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocResponse<HealthSerialization>('health.check', {
            serialization: HealthSerialization,
        }),
    );
}
