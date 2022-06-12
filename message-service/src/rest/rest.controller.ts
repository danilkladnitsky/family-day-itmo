import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
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

  @Post('upload/photo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        messageId: { type: 'number' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './photos/',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          cb(null, file.originalname);
        },
      }),
    }),
  )
  async addPhoto(@UploadedFile() photo, @Body('messageId') messageId: number) {
    if (!messageId) {
      throw new BadRequestException();
    }

    return await this.restService.attachPhoto(photo.filename, messageId);
  }
}
