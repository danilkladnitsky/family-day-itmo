import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { BOT_ROUTER } from 'src/services';
import { ClientProxy } from '@nestjs/microservices';
import { Context } from 'telegraf';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { last } from 'rxjs';

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

    const result = await this.router
      .send({ cmd: 'user.create' }, user)
      .toPromise();

    return true;
  }
}