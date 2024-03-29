import { Injectable } from '@nestjs/common';
import { BOT_NAME } from 'config';
import { InjectBot } from 'nestjs-telegraf';
import { BotTextDTO } from 'src/common/dto/bot.text.dto';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { KeyboardTypes } from 'src/common/enum/keyboard.types.enum';
import { Context, Telegraf } from 'telegraf';
import { Keyboard } from 'telegram-keyboard';
import { receiverLogger, getLabel } from '../logger';

enum LOG_LABELS {
  MESSAGE_FROM_BOT = 'message-from-bot',
  MESSAGE_FROM_USER = 'message-from-user',
  BOT_ERROR = 'bot-error',
  BOT_ACTION = 'bot-action',
  USER_ACTION = 'user-action',
  STICKERS = 'stickers',
}

@Injectable()
export class ReceiverService {
  constructor(
    @InjectBot(BOT_NAME)
    private readonly bot: Telegraf<Context>,
  ) {}

  async sendText(payload: BotTextDTO) {
    const keyboardExists = Boolean(payload.keyboard?.data[0].length);

    const isKeyboardInsideMessage =
      keyboardExists &&
      payload.keyboard.data.every((b) =>
        b.every((k) => k.type === 'IN_MESSAGE'),
      );
    const keyboard = keyboardExists
      ? isKeyboardInsideMessage
        ? Keyboard.make(payload.keyboard.data).inline()
        : Keyboard.make(payload.keyboard.data).reply()
      : { reply_markup: { hide_keyboard: true } };

    const parameters = { one_time_keyboard: true };
    const options = isKeyboardInsideMessage ? { keyboard: null } : {};
    const reply_markup = {
      ...keyboard?.reply_markup,
      ...parameters,
      ...options,
    };

    await this.bot.telegram.sendMessage(payload.userId, payload.text, {
      parse_mode: 'HTML',
      reply_markup,
    });

    receiverLogger.info({
      message: 'Пользователь получил сообщение',
      ...payload,
      labels: getLabel(LOG_LABELS.MESSAGE_FROM_BOT),
    });

    if (payload.attachedPhoto) {
      const imageURL =
        process.env.mode === 'production'
          ? 'https://itmo.partnadem.com/files/' + payload.attachedPhoto
          : 'http://localhost:4000/files/' + payload.attachedPhoto;

      try {
        await this.bot.telegram.sendPhoto(payload.userId, imageURL);

        receiverLogger.info({
          message: 'Пользователь получил фото',
          ...payload,
          labels: LOG_LABELS.MESSAGE_FROM_BOT,
        });
      } catch (err) {
        console.log(err);
        receiverLogger.error({
          message: 'Пользователь не получил фото',
          ...payload,
          err,
          labels: getLabel(LOG_LABELS.MESSAGE_FROM_BOT),
        });
      }
    }
  }

  async sendErrorNotification(payload: MessageDTO<TextDTO>) {
    await this.bot.telegram.sendMessage(
      payload.user.id,
      '<b>Упс, данная кнопка / команда никуда не ведёт.</b>',
      { parse_mode: 'HTML' },
    );
  }
}
