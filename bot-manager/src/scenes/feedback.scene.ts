import { ClientProxy } from '@nestjs/microservices';
import {
  Ctx,
  InjectBot,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { TelegrafContext } from 'src/common/interface/context.interface';
import { BOT_ROUTER } from 'src/services';

@Scene('feedback')
export class FeedbackScene {
  router: ClientProxy;
  pattern: { cmd: string };

  constructor() {
    this.router = BOT_ROUTER;
    this.pattern = { cmd: 'user.message.save' };
  }

  @SceneEnter()
  async onEnter(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Отправьте ваше обращение следующим сообщением:');
  }

  @On('message')
  async saveUserMessage(@Ctx() ctx) {
    const message = {
      userId: ctx.from.id,
      message: ctx.update.message.text,
      firstName: ctx.from.first_name,
      secondName: ctx.from.last_name,
    };

    const res = this.router.send(this.pattern, message);
    res.subscribe((data) => {
      ctx.scene.leave();
    });
  }

  @SceneLeave()
  async onLeave(@Ctx() ctx) {
    ctx.reply('Сообщение было отправлено!');
  }
}
