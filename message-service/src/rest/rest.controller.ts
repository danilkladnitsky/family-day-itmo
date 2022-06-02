import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LinkCreateDTO } from 'src/common/requests/link.create.request';
import { MessageCreateDTO } from 'src/common/requests/message.create.request';
import { RestService } from './rest.service';

@Controller()
export class RestController {
  restService: RestService;
  constructor(restService: RestService) {
    this.restService = restService;
  }
  @Get('links')
  async getLinks() {
    return await this.restService.getLinks();
  }

  @Get('links/:id')
  async getLinkById(@Param('id') id: number) {
    return await this.restService.getLinks(id);
  }

  @Patch('link/:id')
  async updateLink(@Param('id') id: number, @Body() body: LinkCreateDTO) {
    return await this.restService.updateLink(id, body);
  }

  @Get('links/source/:id')
  async getLinkBySourceId(@Param('id') id: number) {
    return await this.restService.getLinksByProperty('source', id);
  }

  @Get('links/target/:id')
  async getLinkByTargetId(@Param('id') id: number) {
    return await this.restService.getLinksByProperty('target', id);
  }

  @Delete('links/:id')
  async deleteLink(@Param('id') id: number) {
    return await this.restService.deleteLink(id);
  }

  // Messages
  @Get('messages')
  async getMessages() {
    return await this.restService.getMessages();
  }

  @Get('messages/:id')
  async getMessagesById(@Param('id') id: number) {
    return await this.restService.getMessages(id);
  }

  @Patch('message/:id')
  async updateMessage(@Param('id') id: number, @Body() body: MessageCreateDTO) {
    return await this.restService.updateMessage(id, body);
  }

  @Post('message')
  async createMessage(@Body() message: MessageCreateDTO) {
    return await this.restService.createMessage(message);
  }

  @Post('message/connect')
  async connectMessages(@Body() body: LinkCreateDTO) {
    console.log(body);

    return await this.restService.connectMessages(body);
  }

  @Delete('message/:id')
  async deleteMessage(@Param('id') id: number) {
    return await this.restService.deleteMessage(id);
  }
}
