import { MessageTypes, TriggerTypes } from '../enum/types.enum';

import { KeyboardDTO } from './keyboard.dto';
import { UserDTO } from '../dto/user.dto';

export type MessageDTO<T> = {
  content: T;
  type: MessageTypes;
  trigger: TriggerTypes;
  user: UserDTO;
  keyboard?: KeyboardDTO;
};
