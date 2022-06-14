import { UseFilters, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BOT_NAME } from 'config';
import {
  Command,
  Ctx,
  InjectBot,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { TelegrafContext } from 'src/common/interface/context.interface';
import { Form } from 'src/decorators/form.decorator';
import { User } from 'src/decorators/user.decorator';
import { TelegrafExceptionFilter } from 'src/filters/telegraf-exception.filter';
import { UserRegisteredGuard } from 'src/guards/auth.guard';
import { BOT_ROUTER } from 'src/services';
import { getCallbackQuery } from 'src/utils/callback_query';
import { Keyboard } from 'telegram-keyboard';

const StatusKeyboard = Keyboard.make([
  [
    {
      text: 'Студент',
      callback_data: JSON.stringify({ step: 'status', value: 'Студент' }),
    },
  ],
  [
    {
      text: 'Сотрудник',
      callback_data: JSON.stringify({ step: 'status', value: 'Сотрудник' }),
    },
  ],
  [
    {
      text: 'Выпускник',
      callback_data: JSON.stringify({ step: 'status', value: 'Выпускник' }),
    },
  ],
]).inline();

const HobiesKeyboard = Keyboard.make([
  [
    {
      text: 'Наука',
      callback_data: JSON.stringify({ step: 'hobies', value: 'Science' }),
    },
  ],
  [
    {
      text: 'IT',
      callback_data: JSON.stringify({ step: 'hobies', value: 'IT' }),
    },
  ],
  [
    {
      text: 'Спорт',
      callback_data: JSON.stringify({ step: 'hobies', value: 'Sport' }),
    },
  ],
  [
    {
      text: 'Предпринимательство',
      callback_data: JSON.stringify({
        step: 'hobies',
        value: 'Business',
      }),
    },
  ],
  [
    {
      text: 'Дети',
      callback_data: JSON.stringify({ step: 'hobies', value: 'Children' }),
    },
  ],
  [
    {
      text: 'Сериалы',
      callback_data: JSON.stringify({ step: 'hobies', value: 'Series' }),
    },
  ],
]).inline();

@Scene('form')
@UseFilters(TelegrafExceptionFilter)
@UseGuards(UserRegisteredGuard)
export class FormScene {
  router: ClientProxy;
  pattern: { cmd: string };
  bot: null;

  constructor(@InjectBot(BOT_NAME) bot) {
    this.router = BOT_ROUTER;
    this.pattern = { cmd: 'user.message.save' };
    this.bot = bot;
  }

  @SceneEnter()
  async onEnter(@Ctx() ctx: TelegrafContext) {
    await (ctx.reply as any)('Укажите свой статус из списка: ', {
      reply_markup: StatusKeyboard.reply_markup,
      one_time_keyboard: true,
    });
  }

  @On('callback_query')
  async onCallback(@Ctx() ctx, @User() user) {
    const data = getCallbackQuery(ctx);

    switch (data.step) {
      case 'status':
        await this.saveFormData('status', data.value, user, ctx);
        await this.handleHobiesChange(ctx);
        return;
      case 'hobies':
        await this.saveFormData('hobies', data.value, user, ctx);
      default:
        return;
    }
  }

  async saveFormData(property: string, value: string, user, ctx) {
    try {
      const result = await this.router
        .send({ cmd: 'form.save' }, { userId: user.id, [property]: value })
        .toPromise();

      await ctx.reply(
        `Сохранил выбор: ${value}.\nВведите команду /quit, чтобы выйти из формы`,
      );
    } catch (err) {
      await ctx.reply('Не удалось сохранить ваш выбор.');
    }
  }

  async handleHobiesChange(@Ctx() ctx) {
    await (ctx.reply as any)(
      'Также выберите интересы на выбор (можно выбрать несколько, нажав на соответствующие ниже кнопки)\nПосле завершения введите команду /quit.',
      {
        reply_markup: HobiesKeyboard.reply_markup,
        one_time_keyboard: true,
      },
    );
  }

  @Command('quit')
  async leaveScene(@Ctx() ctx, @Form() form) {
    await ctx.reply(
      `Статус: ${form.status}\nУвлечения: ${form.hobies
        .split(',')
        .join(', ')}.`,
    );
    await ctx.reply(
      'Вы успешно завершили заполнение анкеты. Теперь вы можете пользоваться остальными функциями бота. Введите /menu, чтобы узнать все возможности.',
    );
    await ctx.scene.leave();
  }
}
