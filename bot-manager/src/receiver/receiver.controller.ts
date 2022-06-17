import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BotTextDTO } from 'src/common/dto/bot.text.dto';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { ReceiverService } from './receiver.service';

const { receiverLogger } = require('../logger');

enum LOG_LABELS {
  MESSAGE_FROM_BOT = 'message-from-bot',
  MESSAGE_FROM_USER = 'message-from-user',
  BOT_ERROR = 'bot-error',
  BOT_ACTION = 'bot-action',
  USER_ACTION = 'user-action',
  STICKERS = 'stickers',
}

@Controller()
export class ReceiverController {
  constructor(private readonly service: ReceiverService) {}

  @EventPattern({ cmd: 'bot.send.message' })
  async sendMessage(@Payload() payload: BotTextDTO) {
    try {
      this.service.sendText(payload);
    } catch (error) {
      console.log(error);

      receiverLogger.error({
        message: 'Ошибка при доставке сообщения от бота',
        ...payload,
        error,
        label: LOG_LABELS.MESSAGE_FROM_BOT,
      });
    }
  }

  @EventPattern({ cmd: 'bot.message.handle-no-action' })
  async sendErrorMessage(@Payload() payload: MessageDTO<TextDTO>) {
    this.service.sendErrorNotification(payload);
  }
}
