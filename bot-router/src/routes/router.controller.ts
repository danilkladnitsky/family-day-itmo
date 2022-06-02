import { Controller } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { MICROSERVICE_GATEWAY } from 'services';
import { MessageDTO } from 'src/common/dto/message.dto';
import { TextDTO } from 'src/common/dto/text.dto';
import { RouterService } from './router.service';

@Controller()
export class RouterController {
  gateway: ClientProxy;
  constructor(private routerService: RouterService) {
    this.gateway = MICROSERVICE_GATEWAY;
  }

  @EventPattern({ cmd: 'router' })
  async onText(@Payload() payload: MessageDTO<TextDTO>) {
    return await this.routerService.onText(payload);
  }
}
