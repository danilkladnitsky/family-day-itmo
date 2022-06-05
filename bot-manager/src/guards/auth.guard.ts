import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';

import { BOT_ROUTER } from 'src/services';
import { ClientProxy } from '@nestjs/microservices';
import { Context } from 'telegraf';

@Injectable()
export class UserRegisteredGuard implements CanActivate {
  router: ClientProxy;
  constructor() {
    this.router = BOT_ROUTER;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const telegramContext = ctx.getContext<Context>();
    const { from } = telegramContext;
    const { id } = from;

    try {
      const user = await this.router
        .send({ cmd: 'user.get' }, { id })
        .toPromise();

      if (!user) {
        (telegramContext as any).scene.leave();
        throw new TelegrafException(
          'Вы не авторизировались. Для регистрации в боте вызовете команду /start',
        );
      }

      return true;
    } catch (err) {
      throw new TelegrafException(
        'Вы не авторизировались. Для регистрации в боте вызовете команду /start',
      );
    }
  }
}
