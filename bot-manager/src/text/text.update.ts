import { UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BOT_NAME } from 'config';
import {
  Command,
  Ctx,
  Hears,
  InjectBot,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { MessageTypes, TriggerTypes } from 'src/common/enum/types.enum';
import { TelegrafContext } from 'src/common/interface/context.interface';
import { StartGuard } from 'src/guards/start.guard';
import { BOT_ROUTER } from 'src/services';
import { Context, Scenes, Telegraf } from 'telegraf';
import { TextService } from './text.service';

import { botLogger, getLabel, LOG_LABELS } from '../logger';

const STICKER_ID =
  'CAACAgIAAxkBAAEE9opio8Qyk8K1Rvj0AbdJEtdGrktEiAACLBcAAul_GEkwrrrh63dP-yQE';

@Update()
export class TextUpdate {
  router: ClientProxy;
  pattern: { cmd: string };

  constructor(
    @InjectBot(BOT_NAME)
    private readonly bot: Telegraf<Context>,
    private readonly service: TextService,
  ) {
    this.router = BOT_ROUTER;
    this.pattern = { cmd: 'router' };
  }

  @UseGuards(StartGuard)
  @Start()
  async onStart(@Ctx() context) {
    botLogger.info({
      message: 'Прописал /start',
      ...context.from,
      labels: getLabel(LOG_LABELS.USER_ACTION),
    });
    await await this.message(context);
  }

  @Command('gift')
  async sendSticker(@Ctx() context: TelegrafContext) {
    try {
      await this.bot.telegram.sendSticker(context.from.id, STICKER_ID);
      await this.bot.telegram.sendMessage(
        context.from.id,
        'Дарим тебе эксклюзивные стикеры ITMO FAMILY DAY!',
      );

      botLogger.info({
        message: 'Получил стикеры',
        ...context.from,
        labels: getLabel(LOG_LABELS.STICKERS),
      });
    } catch (err) {
      console.log(err);
      botLogger.warn({
        message: 'Ошибка при получении стикеров',
        ...context.from,
        labels: getLabel(LOG_LABELS.BOT_ERROR),
      });
    }
  }

  @On('callback_query')
  async onCallbackQuery(@Ctx() context) {
    const query = context.update.callback_query;

    const content: TextDTO = {
      text: query.data,
      message_id: query.message.message_id,
      date: query.message.date,
    };

    const message: MessageDTO<TextDTO> = {
      user: query.from,
      content,
      trigger: TriggerTypes.BUTTON,
      type: MessageTypes.CALLBACK_QUERY,
    };

    botLogger.info({
      message: 'Нажал на кнопку: ' + message.content?.text,
      ...message.user,
      labels: getLabel(LOG_LABELS.USER_ACTION),
    });

    try {
      this.router.emit(this.pattern, message);
    } catch (error) {
      console.log(error);
      botLogger.error({
        message: 'Не смог нажать на кнопку',
        ...message.user,
        labels: getLabel(LOG_LABELS.BOT_ERROR),
      });
    }
  }

  @On('text')
  async message(@Ctx() context) {
    const content: TextDTO = {
      text: context.message.text,
      message_id: context.message.message_id,
      date: context.message.date,
    };

    const message: MessageDTO<TextDTO> = {
      user: context.from,
      content,
      trigger: TriggerTypes.TEXT,
      type: MessageTypes.TEXT,
    };

    botLogger.info({
      message: 'Прислал сообщение: ' + message.content?.text,
      ...message,
      labels: getLabel(LOG_LABELS.MESSAGE_FROM_USER),
    });

    this.service.handleMessageFromUser(message, context);
  }

  @On('photo')
  async onPhoto(@Ctx() context) {
    const photo = context.update.message.photo;

    botLogger.info({
      message: 'Пользователь прислал фотографию',
      ...context.update.message,
      labels: getLabel(LOG_LABELS.MESSAGE_FROM_USER),
    });
  }
}
