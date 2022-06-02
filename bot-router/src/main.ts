import 'dotenv/config';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

const microserviceOptions = {
  name: 'ROUTER_SERVICE',
  transport: Transport.REDIS,
  options: {
    url: 'redis://localhost:6379',
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );
  app.listen();
}

bootstrap();
