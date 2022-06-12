import 'dotenv/config';

import * as basicAuth from 'express-basic-auth';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { PRODUCTION } from 'const/env';
import { RestModule } from './rest/rest.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

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

  const restApp = await NestFactory.create<NestExpressApplication>(RestModule);

  restApp.use(
    ['/docs', '/docs-json', '/api'],
    basicAuth({
      challenge: true,
      users: {
        kladnitsky: 'rl4cqj7',
      },
    }),
  );

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
