import { UseFilters, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/common/interface/context.interface';
import { User } from 'src/decorators/user.decorator';
import { TelegrafExceptionFilter } from 'src/filters/telegraf-exception.filter';
import { UserRegisteredGuard } from 'src/guards/auth.guard';
import { BOT_ROUTER } from 'src/services';
import { getCallbackQuery } from 'src/utils/callback_query';
import { Keyboard } from 'telegram-keyboard';

const FeedbackKeyboard = Keyboard.make([
  [
    {
      text: '🥰',
      callback_data: JSON.stringify({ step: 'status', value: '4' }),
    },
  ],
  [
    {
      text: '😊',
      callback_data: JSON.stringify({ step: 'status', value: '3' }),
    },
  ],
  [
    {
      text: '😐',
      callback_data: JSON.stringify({ step: 'status', value: '2' }),
    },
  ],
  [
    {
      text: '☹',
      callback_data: JSON.stringify({ step: 'status', value: '1' }),
    },
  ],
]).inline();

@Scene('ask')
@UseFilters(TelegrafExceptionFilter)
@UseGuards(UserRegisteredGuard)
export class AskScene {
  router: ClientProxy;
  pattern: { cmd: string };

  constructor() {
    this.router = BOT_ROUTER;
    this.pattern = { cmd: 'user.update.feedback' };
  }

  @SceneEnter()
  async onEnter(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Оцените качество проведения фестиваля:', {
      reply_markup: FeedbackKeyboard.reply_markup,
    });
  }

  @On('callback_query')
  async onCallback(@Ctx() ctx, @User() user) {
    const data = getCallbackQuery(ctx);

    const result = await this.router
      .send(this.pattern, {
        feedback: data?.value ?? '0',
        userId: user.id,
      })
      .toPromise();

    if (result) {
      await ctx.reply('Ваш фидбек был сохранён! Спасибо за участие в опросе!');
      ctx.scene.leave();
    }
  }
}
