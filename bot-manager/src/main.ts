import 'dotenv/config';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const receiverModule =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379',
      },
    });

  receiverModule.listen();
}
bootstrap();
