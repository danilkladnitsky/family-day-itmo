import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';

import { BOT_ROUTER } from 'src/services';
import { Context } from 'telegraf';

export const Form = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const context = TelegrafExecutionContext.create(ctx);
    const telegramContext = context.getContext<Context>();

    const { from } = telegramContext;
    const { id } = from;

    try {
      const form = await BOT_ROUTER.send(
        { cmd: 'form.get' },
        { userId: id },
      ).toPromise();

      return form ?? null;
    } catch (err) {
      throw new TelegrafException(
        'Упс. Что-то произошло с сервисом доставки сообщений.',
      );
    }
  },
);
