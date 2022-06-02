import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { MICROSERVICE_GATEWAY } from 'services';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { MessageTypes } from 'src/common/enum/types.enum';
import { RouteEntity } from 'src/entities/route.entity';
import { Repository } from 'typeorm';

const endpointsByTypes = {
  [MessageTypes.TEXT]: 'message-service.text',
  [MessageTypes.CALLBACK_QUERY]: 'message-service.button',
  [MessageTypes.PHOTO]: 'message-service.photo',
  [MessageTypes.VIDEO]: 'message-service.video',
};

@Injectable()
export class RouterService {
  gateway: ClientProxy;

  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {
    this.gateway = MICROSERVICE_GATEWAY;
  }

  async onText(payload: MessageDTO<TextDTO>) {
    return await this.sendToService(payload);
  }

  async sendToService(payload: MessageDTO<TextDTO>) {
    this.gateway.emit({ cmd: endpointsByTypes[payload.type] }, payload);
  }
}
