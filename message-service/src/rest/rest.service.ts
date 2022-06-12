import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkCreateDTO } from 'src/common/requests/link.create.request';
import { MessageCreateDTO } from 'src/common/requests/message.create.request';
import { Link } from 'src/entities/link.entity';
import { Message } from 'src/entities/messages.entity';
import { MessageService } from 'src/message/message.service';
import { createQueryBuilder, Repository } from 'typeorm';

const crypto = require('crypto');

@Injectable()
export class RestService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  // Links

  async getLinks(id?: number) {
    if (id) {
      return await this.linksRepository.findOne({ id });
    }

    return await this.linksRepository.find();
  }

  async updateLink(id: number, body: LinkCreateDTO) {
    await this.linksRepository.update(
      id,
      body.type === 'IN_MESSAGE'
        ? { ...body, callback_data: crypto.randomBytes(20).toString('hex') }
        : { ...body },
    );

    return await this.getLinks(id);
  }

  async getLinksByProperty(propertyName: string, value: number | string) {
    return await this.linksRepository.find({ [propertyName]: value });
  }

  async deleteLink(id: number) {
    return await this.linksRepository.delete(id);
  }

  //Messages

  async getMessages(id?: number) {
    if (id) {
      return await this.messageRepository.find({ id });
    }

    return await this.messageRepository.find();
  }

  async getMessageWithLinksById(id: number) {
    const result = await createQueryBuilder('message', 'message')
      .leftJoinAndSelect('message.link', 'link')
      .where('message.id = :id', { id })
      .getOne();

    return result;
  }

  async updateMessage(id: number, body: Partial<MessageCreateDTO>) {
    await this.messageRepository.update(id, body);

    return await this.getMessages(id);
  }

  async createMessage(message: MessageCreateDTO) {
    return await this.messageRepository.save(message);
  }

  async connectMessages({
    source,
    target,
    label,
    trigger,
    type,
  }: LinkCreateDTO) {
    const sourceMessage = await this.getMessageWithLinksById(source);
    const targetMessage = await this.getMessages(target);

    if (!sourceMessage || !targetMessage) {
      throw new BadRequestException('Одно из сообщений не существует');
    }

    const sourceLinks = (sourceMessage as Message).link as unknown as [Link];
    const newLink: LinkCreateDTO = { source, target, label, trigger, type };

    const newLinks = [...sourceLinks, newLink];

    (sourceMessage as any).link = newLinks;

    await this.createMessage(sourceMessage as MessageCreateDTO);

    return this.getMessageWithLinksById(source);
  }

  async deleteMessage(id: number) {
    return await this.messageRepository.delete(id);
  }

  async attachPhoto(filepath: string, messageId: number) {
    return await this.messageRepository.update(
      { id: messageId },
      { attachedPhoto: filepath },
    );
  }
}
