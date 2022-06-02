import { ApiProperty } from '@nestjs/swagger';

export class UserMessageRequestDTO {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  message: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  secondName: string;

  @ApiProperty()
  replyMessage: string;
}
