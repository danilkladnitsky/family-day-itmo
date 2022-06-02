import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { MICROSERVICE_GATEWAY } from 'services';
import { UserMessageRequestDTO } from 'src/common/requests/user.message.create.request';
import { MessageFromUser } from 'src/entities/message.from.user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
  bot: ClientProxy;
  constructor(
    @InjectRepository(MessageFromUser)
    private readonly repository: Repository<MessageFromUser>,
  ) {
    this.bot = MICROSERVICE_GATEWAY;
  }

  async createMessage(
    message: UserMessageRequestDTO,
  ): Promise<UserMessageRequestDTO> {
    return await this.repository.save(message);
  }

  async getMessagesByUserId(userId?: string): Promise<UserMessageRequestDTO[]> {
    return userId
      ? await this.repository.find({ userId })
      : await this.repository.find();
  }

  async getMessageById(id: number) {
    return await this.repository.findOne({ id });
  }

  async updateMessage(
    id: number,
    body: Partial<UserMessageRequestDTO>,
  ): Promise<UserMessageRequestDTO> {
    await this.repository.update({ id }, body);

    const message = await this.getMessageById(id);

    const outputMessage = {
      userId: message.userId,
      text:
        'Вам пришло сообщение от администратора бота: \n' +
        message.replyMessage,
    };
    // send message to user
    this.bot.emit({ cmd: 'bot.send.message' }, outputMessage);

    return await this.getMessageById(id);
  }
}
