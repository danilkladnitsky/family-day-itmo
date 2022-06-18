import { FeedbackService } from 'src/feedback/feedback.service';
import { Form } from 'src/entities/forms.entity';
import { Link } from 'src/entities/link.entity';
import { Message } from 'src/entities/messages.entity';
import { MessageController } from './message.controller';
import { MessageFromUser } from 'src/entities/message.from.user.entity';
import { MessageService } from './message.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Link, MessageFromUser, User, Form]),
  ],
  controllers: [MessageController],
  providers: [MessageService, FeedbackService],
})
export class MessageModule {}
