import { AppController } from './app.controller';
import { BotModule } from './bot.module';
import { Module } from '@nestjs/common';
import { ReceiverModule } from './receiver/receiver.module';

@Module({
  controllers: [AppController],
  imports: [BotModule, ReceiverModule],
})
export class AppModule {}
