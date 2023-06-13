import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'subscribers',
      protoPath: join(process.cwd(), 'src/subscribers/subscribers.proto'),
      // url: configService.get('GRPC_CONNECTION_URL'),
    },
  });

  app.listen(() => {
    console.log('Microservice is listening...');
  });
}
bootstrap();
