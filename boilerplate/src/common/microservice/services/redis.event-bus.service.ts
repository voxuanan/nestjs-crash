import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import ms from 'ms';

@Injectable()
export class RedisEventBusService {
    private readonly pub: Redis;
    private readonly sub: Redis;
    private readonly timeout;

    constructor(private readonly configService: ConfigService) {
        const host = this.configService.get<string>('microservice.redis.host');
        const port = this.configService.get<number>('microservice.redis.port');
        this.timeout =
            this.configService.get<number>('microservice.timeout') || ms('5m');

        this.sub = new Redis({
            host,
            port,
        });
        this.pub = new Redis({
            host,
            port,
        });
    }

    sendSyncRequest = (data: any) => {
        const id = uuidv4();
        const channel = `request:${id}`;
        const responseChannel = `response:${id}`;
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, this.timeout);
        });

        const responsePromise = new Promise((resolve, reject) => {
            this.sub.subscribe(responseChannel, (err, count) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.pub.publish(channel, JSON.stringify(data));

                this.sub.on('message', (channel, message) => {
                    if (channel === responseChannel) {
                        this.sub.unsubscribe(responseChannel);
                        resolve(JSON.parse(message));
                    }
                });
            });
        });

        return Promise.race([responsePromise, timeoutPromise]);
    };
}
