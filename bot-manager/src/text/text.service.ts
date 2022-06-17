import { Injectable, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BOT_NAME } from 'config';
import { InjectBot } from 'nestjs-telegraf';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { TelegrafContext } from 'src/common/interface/context.interface';
import { BOT_ROUTER } from 'src/services';
import { Context, Telegraf } from 'telegraf';

const { botLogger } = require('../logger');

enum LOG_LABELS {
  MESSAGE_FROM_BOT = 'message-from-bot',
  MESSAGE_FROM_USER = 'message-from-user',
  BOT_ERROR = 'bot-error',
  BOT_ACTION = 'bot-action',
  USER_ACTION = 'user-action',
  STICKERS = 'stickers',
}

@Injectable()
export class TextService {
  router: ClientProxy;
  pattern: { cmd: string };

  constructor(
    @InjectBot(BOT_NAME)
    private readonly bot: Telegraf<Context>,
  ) {
    this.router = BOT_ROUTER;
    this.pattern = { cmd: 'router' };
  }

  async handleMessageFromUser(
    message: MessageDTO<TextDTO>,
    ctx: TelegrafContext,
  ) {
    if (
      message.content.text === 'Задать вопрос' ||
      message.content.text === '💬 Задать вопрос'
    ) {
      this.joinUserToFeedbackScene(ctx);
      return;
    }

    if (
      message.content.text === 'Заполнить анкету' ||
      message.content.text === 'Заполнить анкету ✍️'
    ) {
      this.joinUserToFormScene(ctx);
      return;
    }

    if (message.content.text === 'Показать месторасположение фестиваля') {
      this.bot.telegram.sendLocation(ctx.from.id, 59.98061, 30.267514);
      return;
    }

    this.sendToMessageService(message);
  }

  async sendToMessageService(message: MessageDTO<TextDTO>) {
    try {
      this.router.emit(this.pattern, message);
    } catch (error) {
      botLogger.error({
        message: 'Не смог отправить сообщение' + error,
        ...message,
        labels: LOG_LABELS.MESSAGE_FROM_USER,
      });
    }
  }

  async joinUserToFeedbackScene(ctx: TelegrafContext) {
    ctx.scene.enter('feedback');
  }

  async joinUserToFormScene(ctx: TelegrafContext) {
    ctx.scene.enter('form');
  }
}
