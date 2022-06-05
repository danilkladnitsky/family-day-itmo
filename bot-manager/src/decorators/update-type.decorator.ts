import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { TelegrafExecutionContext } from 'nestjs-telegraf';

export const UpdateType = createParamDecorator(
  (_, ctx: ExecutionContext) =>
    TelegrafExecutionContext.create(ctx).getContext().updateType,
);
