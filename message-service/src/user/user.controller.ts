import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Form } from 'src/entities/forms.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @MessagePattern({ cmd: 'user.get' })
  async getUserByTelegramId(@Payload('id') id: string) {
    return await this.service.getUser(id);
  }

  @MessagePattern({ cmd: 'user.create' })
  async createUser(@Payload() user: User) {
    return await this.service.createUser(user);
  }

  @MessagePattern({ cmd: 'form.save' })
  async saveForm(@Payload() form: Partial<Form>) {
    return await this.service.saveForm(form);
  }

  @MessagePattern({ cmd: 'form.get' })
  async getForm(@Payload('userId') userId: string) {
    const res = await this.service.getFormByUserId(userId);
    return res;
  }

  @MessagePattern({ cmd: 'form.find' })
  async findForm(@Payload('UserId') userId: string) {
    const res = await this.service.findForm(userId);
    return res;
  }
}
