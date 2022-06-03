import { ClientProxy } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { MICROSERVICE_GATEWAY } from 'services';
import { MessageDTO } from 'src/common/dto/message.dto';
import { MessageTypes } from 'src/common/enum/types.enum';
import { TextDTO } from 'src/common/dto/text.dto';

const endpointsByTypes = {
  [MessageTypes.TEXT]: 'message-service.text',
  [MessageTypes.CALLBACK_QUERY]: 'message-service.button',
  [MessageTypes.PHOTO]: 'message-service.photo',
  [MessageTypes.VIDEO]: 'message-service.video',
};

@Injectable()
export class RouterService {
  gateway: ClientProxy;

  constructor() {
    this.gateway = MICROSERVICE_GATEWAY;
  }

  async onText(payload: MessageDTO<TextDTO>) {
    return await this.sendToService(payload);
  }

  async sendToService(payload: MessageDTO<TextDTO>) {
    this.gateway.emit({ cmd: endpointsByTypes[payload.type] }, payload);
  }
}
