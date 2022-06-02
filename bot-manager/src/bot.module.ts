import { BOT_NAME, BOT_TOKEN } from 'config';

import { Module } from '@nestjs/common';
import { ReceiverModule } from './receiver/receiver.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { TextModule } from './text/text.module';
import { sessionMiddleware } from './middleware';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: BOT_TOKEN,
        include: [TextModule, ReceiverModule],
        middlewares: [sessionMiddleware],
      }),
    }),
    TextModule,
  ],
})
export class BotModule {}
