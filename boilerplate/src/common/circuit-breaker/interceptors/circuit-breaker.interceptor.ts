import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CircuitBreaker } from '../circuit-breaker';
import { Reflector } from '@nestjs/core';
import { CIRCUIT_BREAKER_CONFIG_META_KEY } from '../constants/circuit-breaker.constant';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    private readonly circuitBreakerByHandler = new WeakMap<
        // eslint-disable-next-line @typescript-eslint/ban-types
        Function,
        CircuitBreaker
    >();

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const methodRef = context.getHandler();

        let circuitBreakerConfig = this.reflector.get(
            CIRCUIT_BREAKER_CONFIG_META_KEY,
            context.getClass(),
        );

        if (!circuitBreakerConfig) {
            circuitBreakerConfig = this.reflector.get(
                CIRCUIT_BREAKER_CONFIG_META_KEY,
                methodRef,
            );
        }
        const { successThreshold, failureThreshold, openToHalfOpenWaitTime } =
            circuitBreakerConfig;

        let circuitBreaker: CircuitBreaker;
        if (this.circuitBreakerByHandler.has(methodRef)) {
            circuitBreaker = this.circuitBreakerByHandler.get(methodRef);
        } else {
            circuitBreaker = new CircuitBreaker(
                successThreshold,
                failureThreshold,
                openToHalfOpenWaitTime,
            );
            this.circuitBreakerByHandler.set(methodRef, circuitBreaker);
        }
        return circuitBreaker.exec(next);
    }
}
