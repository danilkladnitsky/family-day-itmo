import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { MICROSERVICE_GATEWAY } from 'services';
import { UserMessageRequestDTO } from 'src/common/requests/user.message.create.request';
import { Form } from 'src/entities/forms.entity';
import { MessageFromUser } from 'src/entities/message.from.user.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
  bot: ClientProxy;
  constructor(
    @InjectRepository(MessageFromUser)
    private readonly repository: Repository<MessageFromUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
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

  async sendMessage(userId: string, message: string) {
    const outputMessage = {
      userId,
      text: 'Вам пришло сообщение от администратора бота: \n' + message,
    };
    // send message to user
    this.bot.emit({ cmd: 'bot.send.message' }, outputMessage);
  }

  async pairPeople(userIdOne: string, userIdTwo: string) {
    const userOne = await this.userRepository.findOne({ userId: userIdOne });
    const userTwo = await this.userRepository.findOne({ userId: userIdTwo });
    this.formRepository.update(
      { userId: userOne.id as unknown as string },
      { partner: userOne },
    );
    this.formRepository.update(
      { userId: userTwo.id as unknown as string },
      { partner: userTwo },
    );

    await this.sendMessage(
      userIdOne,
      `Я нашел собеседника для тебя! 🤝\nТвоя пара: ${
        userTwo.firstName ?? 'имя не указано'
      } ${userTwo.firstName ?? 'фамилия не указана'}\n Профиль: @${
        userTwo.username ?? 'профиль не найден'
      }`,
    );

    await this.sendMessage(
      userIdTwo,
      `Я нашел собеседника для тебя! 🤝\n Твоя пара: ${
        userOne.firstName ?? 'имя не указано'
      } ${userOne.firstName ?? 'фамилия не указана'}\n Профиль: @${
        userOne.username ?? 'профиль не найден'
      }`,
    );
  }
}
