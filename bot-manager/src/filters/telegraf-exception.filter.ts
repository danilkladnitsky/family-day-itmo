import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Context } from 'telegraf';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();

    await ctx.replyWithHTML(`<b>❌</b>: ${exception.message}`);
  }
}
