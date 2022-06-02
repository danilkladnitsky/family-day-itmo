import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BotTextDTO } from 'src/common/dto/bot.text.dto';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { ReceiverService } from './receiver.service';

@Controller()
export class ReceiverController {
  constructor(private readonly service: ReceiverService) {}

  @EventPattern({ cmd: 'bot.send.message' })
  async sendMessage(@Payload() payload: BotTextDTO) {
    this.service.sendText(payload);
  }

  @EventPattern({ cmd: 'bot.message.handle-no-action' })
  async sendErrorMessage(@Payload() payload: MessageDTO<TextDTO>) {
    this.service.sendErrorNotification(payload);
  }
}
