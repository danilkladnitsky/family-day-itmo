import { ClientProxy } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { MICROSERVICE_GATEWAY } from 'services';
import { TextDTO } from 'src/common/dto/text.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/messages.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { MessageDTO } from 'src/common/dto/message.dto';
import { Link } from 'src/entities/link.entity';
import { ButtonSize } from 'src/common/enum/button.size.enum';

@Injectable()
export class MessageService {
  bot: ClientProxy;
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {
    this.bot = MICROSERVICE_GATEWAY;
  }

  // database API
  async getSourceMessage(trigger: string, trigger_name = 'trigger') {
    const result = await createQueryBuilder('message', 'message')
      .leftJoinAndSelect('message.link', 'link')
      .where(`link.${trigger_name} = :${trigger_name}`, {
        [trigger_name]: trigger,
      })
      .getOne();

    return result;
  }

  async getTargetMessage(id: number) {
    return await this.messageRepository.findOne(id);
  }

  async getOutputLinks(messageId: number) {
    const result = await createQueryBuilder('link', 'link')
      .leftJoinAndSelect('link.message', 'message')
      .where('link.source = :messageId', { messageId })
      .getMany();

    return result;
  }

  async send(payload: MessageDTO<TextDTO>) {
    const sourceMessage: Partial<Message> = await this.getSourceMessage(
      payload.content.text,
      payload.type === 'TEXT' ? 'trigger' : 'callback_data',
    );

    if (!sourceMessage) {
      return;
    }

    const targetMessageId = sourceMessage.link[0].target;

    if (!targetMessageId) {
      return;
    }

    const targetMessage: Partial<Message> = await this.getTargetMessage(
      targetMessageId,
    );

    const outputMessage = {
      userId: payload.user.id,
      text: targetMessage.text,
      keyboard: { data: await this.getKeyboard(targetMessage.id) },
    };

    this.bot.emit({ cmd: 'bot.send.message' }, outputMessage);
  }

  async getKeyboard(messageId: number) {
    const keyboard_data = await this.getOutputLinks(messageId);

    const links = keyboard_data as Link[];

    const fullSizeButtons = links
      .filter((b) => b.size === ButtonSize.FULL)
      .map((button: Link) => [
        {
          text: button.label,
          callback_data: button.callback_data,
          type: button.type,
        },
      ]);

    const halfSizeButtons = links
      .filter((b) => b.size === ButtonSize.HALF)
      .map((button: Link) => ({
        text: button.label,
        callback_data: button.callback_data,
        type: button.type,
      }));

    const thirdSizeButtons = links
      .filter((b) => b.size === ButtonSize.THIRD)
      .map((button: Link) => ({
        text: button.label,
        callback_data: button.callback_data,
        type: button.type,
      }));

    const keyboard = [
      ...fullSizeButtons,
      ...[halfSizeButtons],
      ...[thirdSizeButtons],
    ]; // make better layout (have bugs)

    return keyboard;
  }
}
