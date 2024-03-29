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

const { botLogger, getLabel, LOG_LABELS } = require('../logger');

const StatusKeyboard = Keyboard.make([
  [
    {
      text: '🧑‍💻  Студент',
      callback_data: JSON.stringify({ step: 'status', value: 'Студент' }),
    },
  ],
  [
    {
      text: '🧑‍💼 Сотрудник',
      callback_data: JSON.stringify({ step: 'status', value: 'Сотрудник' }),
    },
  ],
  [
    {
      text: '🧑‍🎓 Выпускник /🤴 Гость',
      callback_data: JSON.stringify({ step: 'status', value: 'Выпускник' }),
    },
  ],
]).inline();

const HobiesKeyboard = Keyboard.make([
  [
    {
      text: '🔬Наука',
      callback_data: JSON.stringify({ step: 'hobies', value: 'Science' }),
    },
  ],
  [
    {
      text: '💻 IT',
      callback_data: JSON.stringify({ step: 'hobies', value: 'IT' }),
    },
  ],
  [
    {
      text: '⛹️‍♂️ Спорт',
      callback_data: JSON.stringify({ step: 'hobies', value: 'Sport' }),
    },
  ],
  [
    {
      text: '💰Предпринимательство',
      callback_data: JSON.stringify({
        step: 'hobies',
        value: 'Business',
      }),
    },
  ],
  [
    {
      text: '🎞 Кино и сериалы',
      callback_data: JSON.stringify({
        step: 'hobies',
        value: 'Cinema and series',
      }),
    },
  ],
  [
    {
      text: '♻️Экология',
      callback_data: JSON.stringify({
        step: 'hobies',
        value: 'Ecology',
      }),
    },
  ],
  [
    {
      text: '👶 Воспитание детей',
      callback_data: JSON.stringify({ step: 'hobies', value: 'Children' }),
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
  async onEnter(@Ctx() ctx: TelegrafContext, @Form() form, @User() user) {
    if (!user) {
      ctx.reply(
        'Упс, похоже вы не зарегистрировались в боте. Пропишите команду /start ещё раз.',
      );
      ctx.scene.leave();
    }
    if (form?.hobies) {
      await (ctx.reply as any)('Твоя анкета уже заполнена.');
      await ctx.scene.leave();

      botLogger.info({
        message: 'Пользователь уже заполнял анкету',
        ...ctx.from,
        labels: getLabel(LOG_LABELS.USER_ACTION),
      });
      return;
    }
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
        `Сохранил выбор: ${value}.\nВведи команду /quit, чтобы выйти из формы`,
      );

      botLogger.info({
        message: 'Пользователь обновил анкету',
        ...ctx.from,
        [property]: value,
        labels: getLabel(LOG_LABELS.USER_ACTION),
      });
    } catch (err) {
      console.log(err);

      botLogger.error({
        message: 'Пользователь не смог обновить анкету',
        ...ctx.from,
        [property]: value,
        err,
        labels: getLabel(LOG_LABELS.USER_ACTION),
      });
      await ctx.reply('Не удалось сохранить ваш выбор.');
    }
  }

  async handleHobiesChange(@Ctx() ctx) {
    await (ctx.reply as any)(
      'Выбери из списка на какие темы тебе интересно пообщаться. Можешь выбрать несколько, так твои шансы встретить собеседника возрастут. После завершения введи команду /quit.',
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

    botLogger.info({
      message: 'Пользователь заполнил анкету',
      ...ctx.from,
      ...form,
      labels: getLabel(LOG_LABELS.USER_ACTION),
    });
    await ctx.reply(
      '🙌 Получилось! Теперь ты — участник встреч ITMO FAMILY DAY.\nКак только у нас появится подходящая пара, я пришлю тебе контакт в сообщении.\nМы рекомендуем встретиться на фестивале, договорившись о месте встречи.📍\nТакже вы сможете продолжить общение в чате. 💬',
    );
    await ctx.scene.leave();
  }
}
