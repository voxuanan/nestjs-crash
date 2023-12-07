import { SetMetadata, UseInterceptors } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { CIRCUIT_BREAKER_CONFIG_META_KEY } from '../constants/circuit-breaker.constant';
import { CircuitBreakerInterceptor } from 'src/common/circuit-breaker/interceptors/circuit-breaker.interceptor';

export function ApplyCircuitBreaker(config: {
    successThreshold: number;
    failureThreshold: number;
    openToHalfOpenWaitTime: number;
}): MethodDecorator {
    return applyDecorators(
        UseInterceptors(CircuitBreakerInterceptor),
        SetMetadata(CIRCUIT_BREAKER_CONFIG_META_KEY, config),
    );
}
