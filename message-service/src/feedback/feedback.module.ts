import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { Form } from 'src/entities/forms.entity';
import { MessageFromUser } from 'src/entities/message.from.user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form, User, MessageFromUser])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
