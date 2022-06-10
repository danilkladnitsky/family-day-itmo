import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
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
    console.log(id, body);

    return await this.feedbackService.updateMessage(id, body);
  }
}
