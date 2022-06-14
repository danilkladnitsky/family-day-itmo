import { Injectable, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BOT_NAME } from 'config';
import { InjectBot } from 'nestjs-telegraf';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { TelegrafContext } from 'src/common/interface/context.interface';
import { UserRegisteredGuard } from 'src/guards/auth.guard';
import { BOT_ROUTER } from 'src/services';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class TextService {
  router: ClientProxy;
  pattern: { cmd: string };

  constructor(
    @InjectBot(BOT_NAME)
    private readonly bot: Telegraf<Context>,
  ) {
    this.router = BOT_ROUTER;
    this.pattern = { cmd: 'router' };
  }

  async handleMessageFromUser(
    message: MessageDTO<TextDTO>,
    ctx: TelegrafContext,
  ) {
    if (message.content.text === 'Задать вопрос') {
      this.joinUserToFeedbackScene(ctx);
      return;
    }

    if (
      message.content.text === 'Заполнить анкету' ||
      message.content.text === 'Заполнить анкету ✍️'
    ) {
      this.joinUserToFormScene(ctx);
      return;
    }

    this.sendToMessageService(message);
  }

  async sendToMessageService(message: MessageDTO<TextDTO>) {
    this.router.emit(this.pattern, message);
  }

  async joinUserToFeedbackScene(ctx: TelegrafContext) {
    ctx.scene.enter('feedback');
  }

  async joinUserToFormScene(ctx: TelegrafContext) {
    ctx.scene.enter('form');
  }
}
