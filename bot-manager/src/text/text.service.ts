import { Controller, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BOT_NAME } from 'config';
import { Ctx, InjectBot } from 'nestjs-telegraf';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { TelegrafContext } from 'src/common/interface/context.interface';
import { BOT_ROUTER } from 'src/services';
import { Context, Scenes, Telegraf } from 'telegraf';

@Injectable()
export class TextService {
  router: ClientProxy;
  pattern: { cmd: string };

  constructor(
    @InjectBot(BOT_NAME)
    private readonly bot: Telegraf<Context>,
  ) {
    this.router = BOT_ROUTER;
    this.pattern = { cmd: 'message-service.text' };
  }

  async handleMessageFromUser(
    message: MessageDTO<TextDTO>,
    ctx: TelegrafContext,
  ) {
    if (message.content.text === 'Обратная связь') {
      ctx.scene.enter('feedback');

      return;
    }

    this.sendToMessageService(message);
  }

  async sendToMessageService(message: MessageDTO<TextDTO>) {
    this.router.emit(this.pattern, message);
  }
}
