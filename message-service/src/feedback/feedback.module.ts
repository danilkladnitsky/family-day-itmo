import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { MessageFromUser } from 'src/entities/message.from.user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MessageFromUser])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
