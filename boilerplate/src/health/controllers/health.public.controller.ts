import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { HealthCheckDoc } from 'src/health/docs/health.doc';
import { HealthSerialization } from 'src/health/serializations/health.serialization';
import { Connection } from 'typeorm';
import { HealthAwsS3Indicator } from '../indicators/health.aws-s3.indicator';

@ApiTags('health')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/health',
})
export class HealthPublicController {
    constructor(
        @InjectConnection()
        private defaultConnection: Connection,
        private readonly health: HealthCheckService,
        private readonly memoryHealthIndicator: MemoryHealthIndicator,
        private readonly diskHealthIndicator: DiskHealthIndicator,
        private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
        private readonly awsS3Indicator: HealthAwsS3Indicator,
    ) {}

    @HealthCheckDoc()
    @Response('health.check', { serialization: HealthSerialization })
    @HealthCheck()
    @Get('/aws')
    async checkAws(): Promise<IResponse> {
        const data = await this.health.check([
            () => this.awsS3Indicator.isHealthy('awsS3Bucket'),
        ]);

        return {
            data,
        };
    }

    @HealthCheckDoc()
    @Response('health.check', { serialization: HealthSerialization })
    @HealthCheck()
    @Get('/database')
    async checkDatabase(): Promise<IResponse> {
        const data = await this.health.check([
            () =>
                this.typeOrmHealthIndicator.pingCheck('database', {
                    connection: this.defaultConnection,
                }),
        ]);

        return {
            data,
        };
    }

    @HealthCheckDoc()
    @Response('health.check', { serialization: HealthSerialization })
    @HealthCheck()
    @Get('/memory-heap')
    async checkMemoryHeap(): Promise<IResponse> {
        const data = await this.health.check([
            () =>
                this.memoryHealthIndicator.checkHeap(
                    'memoryHeap',
                    300 * 1024 * 1024,
                ),
        ]);

        return {
            data,
        };
    }

    @HealthCheckDoc()
    @Response('health.check', { serialization: HealthSerialization })
    @HealthCheck()
    @Get('/memory-rss')
    async checkMemoryRss(): Promise<IResponse> {
        const data = await this.health.check([
            () =>
                this.memoryHealthIndicator.checkRSS(
                    'memoryRss',
                    300 * 1024 * 1024,
                ),
        ]);

        return {
            data,
        };
    }

    @HealthCheckDoc()
    @Response('health.check', { serialization: HealthSerialization })
    @HealthCheck()
    @Get('/storage')
    async checkStorage(): Promise<IResponse> {
        const data = await this.health.check([
            () =>
                this.diskHealthIndicator.checkStorage('diskHealth', {
                    thresholdPercent: 0.75,
                    path: '/',
                }),
        ]);

        return {
            data,
        };
    }
}
