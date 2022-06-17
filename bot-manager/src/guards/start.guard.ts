import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { botLogger, getLabel } from '../logger';

import { BOT_ROUTER } from 'src/services';
import { ClientProxy } from '@nestjs/microservices';
import { Context } from 'telegraf';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

enum LOG_LABELS {
  MESSAGE_FROM_BOT = 'message-from-bot',
  MESSAGE_FROM_USER = 'message-from-user',
  BOT_ERROR = 'bot-error',
  BOT_ACTION = 'bot-action',
  USER_ACTION = 'user-action',
  STICKERS = 'stickers',
}
@Injectable()
export class StartGuard implements CanActivate {
  router: ClientProxy;
  constructor() {
    this.router = BOT_ROUTER;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();
    const { id, last_name, first_name, username, language_code } = from;

    const user = {
      userId: id,
      firstName: first_name,
      lastName: last_name,
      username,
      languageCode: language_code,
    };

    try {
      await this.router.send({ cmd: 'user.create' }, user).toPromise();

      botLogger.info({
        message: 'Пользователь зарегистрировался',
        ...from,
        labels: getLabel(LOG_LABELS.USER_ACTION),
      });

      return true;
    } catch (err) {
      botLogger.error({
        message: 'Ошибка при регистрации пользователя' + err,
        ...from,
        label: getLabel(LOG_LABELS.BOT_ERROR),
      });
    }

    return true;
  }
}
