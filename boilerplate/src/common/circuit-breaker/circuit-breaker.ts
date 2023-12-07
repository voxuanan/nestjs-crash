import { CallHandler } from '@nestjs/common';
import { tap, throwError } from 'rxjs';
import { CIRCUIT_BREAKER_STATE } from './constants/circuit-breaker.enum.constant';

export class CircuitBreaker {
    private state = CIRCUIT_BREAKER_STATE.Closed;
    private failureCount = 0;
    private successCount = 0;
    private lastError: Error;
    private nextAttempt: number;
    private readonly successThreshold: number = 3;
    private readonly failureThreshold: number = 3;
    private readonly openToHalfOpenWaitTime: number = 60000;

    constructor(
        successThreshold: number | undefined,
        failureThreshold: number | undefined,
        openToHalfOpenWaitTime: number | undefined,
    ) {
        if (successThreshold !== undefined) {
            this.successThreshold = successThreshold;
        }
        if (failureThreshold !== undefined) {
            this.failureThreshold = failureThreshold;
        }
        if (openToHalfOpenWaitTime !== undefined) {
            this.openToHalfOpenWaitTime = openToHalfOpenWaitTime;
        }
    }

    private handleSuccess() {
        this.failureCount = 0;
        if (this.state === CIRCUIT_BREAKER_STATE.HalfOpen) {
            this.successCount++;

            if (this.successCount >= this.successThreshold) {
                this.successCount = 0;
                this.state = CIRCUIT_BREAKER_STATE.Closed;
            }
        }
    }

    private handleError(err: Error) {
        this.failureCount++;
        if (
            this.failureCount >= this.failureThreshold ||
            this.state === CIRCUIT_BREAKER_STATE.HalfOpen
        ) {
            this.state = CIRCUIT_BREAKER_STATE.Open;
            this.lastError = err;
            this.nextAttempt = Date.now() + this.openToHalfOpenWaitTime;
        }
    }

    exec(next: CallHandler) {
        if (this.state === CIRCUIT_BREAKER_STATE.Open) {
            if (this.nextAttempt > Date.now()) {
                return throwError(() => this.lastError);
            }
            this.state = CIRCUIT_BREAKER_STATE.HalfOpen;
        }

        return next.handle().pipe(
            tap({
                next: () => this.handleSuccess(),
                error: (err) => this.handleError(err),
            }),
        );
    }
}
