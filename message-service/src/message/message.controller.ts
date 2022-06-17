import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { FeedbackService } from 'src/feedback/feedback.service';
import { UserMessageRequestDTO } from 'src/common/requests/user.message.create.request';

@Controller()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @MessagePattern({ cmd: 'message-service.text' })
  async sendMessageOnText(@Payload() payload: MessageDTO<TextDTO>) {
    await this.messageService.send(payload);
  }

  @MessagePattern({ cmd: 'message-service.button' })
  async sendMessageOnButton(@Payload() payload: MessageDTO<TextDTO>) {
    await this.messageService.send(payload);
  }

  @MessagePattern({ cmd: 'user.message.get' })
  async getUserMessage(@Payload('userId') userId: string) {
    return await this.feedbackService.getMessagesByUserId(userId);
  }

  @MessagePattern({ cmd: 'user.message.save' })
  async saveUserMessage(@Payload() message: UserMessageRequestDTO) {
    return await this.feedbackService.createMessage(message);
  }

  // todo: add other message types
}
