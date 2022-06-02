import { ClientProxy } from '@nestjs/microservices';
import { BOT_NAME } from 'config';
import {
  Command,
  Ctx,
  Hears,
  InjectBot,
  On,
  TelegrafContextType,
  Update,
} from 'nestjs-telegraf';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { MessageTypes, TriggerTypes } from 'src/common/enum/types.enum';
import { TelegrafContext } from 'src/common/interface/context.interface';
import { BOT_ROUTER } from 'src/services';
import { Context, Scenes, Telegraf } from 'telegraf';
import { TextService } from './text.service';

@Update()
export class TextUpdate {
  router: ClientProxy;
  pattern: { cmd: string };

  constructor(
    @InjectBot(BOT_NAME)
    private readonly bot: Telegraf<Context>,
    private readonly service: TextService,
  ) {
    this.router = BOT_ROUTER;
    this.pattern = { cmd: 'router' };
  }

  @On('callback_query')
  async onCallbackQuery(@Ctx() context) {
    const query = context.update.callback_query;

    const content: TextDTO = {
      text: query.data,
      message_id: query.message.message_id,
      date: query.message.date,
    };

    const message: MessageDTO<TextDTO> = {
      user: query.from,
      content,
      trigger: TriggerTypes.BUTTON,
      type: MessageTypes.CALLBACK_QUERY,
    };

    this.router.emit(this.pattern, message);
  }

  @On('text')
  async message(@Ctx() context) {
    const content: TextDTO = {
      text: context.message.text,
      message_id: context.message.message_id,
      date: context.message.date,
    };

    const message: MessageDTO<TextDTO> = {
      user: context.from,
      content,
      trigger: TriggerTypes.TEXT,
      type: MessageTypes.TEXT,
    };

    this.service.handleMessageFromUser(message, context);
  }

  @On('photo')
  async onPhoto(@Ctx() context) {
    const photo = context.update.message.photo;

    console.log(context);

    // const res = await this.bot.telegram.getFileLink(photo[0].file_id);
    // console.log(res);
  }
}
