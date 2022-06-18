import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { UserMessageRequestDTO } from 'src/common/requests/user.message.create.request';

import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async createMessage(@Body() message: UserMessageRequestDTO) {
    return await this.feedbackService.createMessage(message);
  }

  @Get()
  async getMessages() {
    return await this.feedbackService.getMessagesByUserId();
  }

  @Patch('/:id')
  async updateMessage(
    @Param('id') id: number,
    @Body() body: Partial<UserMessageRequestDTO>,
  ) {
    return await this.feedbackService.updateMessage(id, body);
  }

  @Patch('send/:userId')
  async sendMessage(@Param('userId') id: string, @Body() message: string) {
    return await this.feedbackService.sendMessage(id, message);
  }
  @Patch('pair/:userIdOne/:userIdTwo')
  async pair(
    @Param('userIdOne') userIdOne: string,
    @Param('userIdTwo') userIdTwo: string,
  ) {
    return await this.feedbackService.pairPeople(userIdOne, userIdTwo);
  }

  @Post('global')
  async sendGlobalMessage(@Query('message') message: string) {
    await this.feedbackService.sendGlobalMessage(message);
  }
}
