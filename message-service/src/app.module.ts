import { FeedbackModule } from './feedback/feedback.module';
import { MessageModule } from './message/message.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'config.service';

@Module({
  imports: [
    MessageModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
  ],
})
export class AppModule {}
