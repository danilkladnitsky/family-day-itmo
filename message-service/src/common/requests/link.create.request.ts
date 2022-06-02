import { ApiProperty } from '@nestjs/swagger';
import { KeyboardTypes } from '../enum/keyboard.types.enum';

export class LinkCreateDTO {
  @ApiProperty()
  source: number;
  @ApiProperty()
  target: number;
  @ApiProperty()
  label: string;
  @ApiProperty()
  trigger?: string;
  @ApiProperty({ default: KeyboardTypes.STANDALONE })
  type: KeyboardTypes;
}
