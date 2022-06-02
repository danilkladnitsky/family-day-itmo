import { ApiProperty } from '@nestjs/swagger';
import { MessageTypes } from '../enum/types.enum';

export class MessageCreateDTO {
  @ApiProperty()
  text: string;
  @ApiProperty({ default: MessageTypes.TEXT })
  type?: MessageTypes;
}
