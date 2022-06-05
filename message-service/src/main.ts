import 'dotenv/config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { PRODUCTION } from 'const/env';
import { RestModule } from './rest/rest.module';
import { Transport } from '@nestjs/microservices';

require('dotenv').config();

const microserviceOptions = {
  name: 'MESSAGE_SERVICE',
  transport: Transport.REDIS,
  options: {
    url: PRODUCTION ? 'redis://redis:6379' : 'redis://localhost:6379',
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );

  app.listen();

  const restApp = await NestFactory.create(RestModule);

  restApp.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Message service')
    .setDescription('Message service API description')
    .setVersion('1.0')
    .addTag('blaze-bot')
    .build();
  const document = SwaggerModule.createDocument(restApp, config);
  SwaggerModule.setup('api', restApp, document);

  await restApp.listen(4000);
}

bootstrap();
