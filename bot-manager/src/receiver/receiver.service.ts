import { Injectable } from '@nestjs/common';
import { BOT_NAME } from 'config';
import { InjectBot } from 'nestjs-telegraf';
import { BotTextDTO } from 'src/common/dto/bot.text.dto';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { KeyboardTypes } from 'src/common/enum/keyboard.types.enum';
import { Context, Telegraf } from 'telegraf';
import { Keyboard } from 'telegram-keyboard';

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

    await this.bot.telegram.sendMessage(payload.userId, payload.text, {
      parse_mode: 'HTML',
      remove_keyboard: true,
      ...keyboard,
    });
  }

  async sendErrorNotification(payload: MessageDTO<TextDTO>) {
    await this.bot.telegram.sendMessage(
      payload.user.id,
      '<b>Упс, данная кнопка / команда никуда не ведёт.</b>',
      { parse_mode: 'HTML' },
    );
  }
}
