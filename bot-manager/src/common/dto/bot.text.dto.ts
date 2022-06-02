import { KeyboardButtonDTO, KeyboardDTO } from './keyboard.dto';

export type BotTextDTO = {
  userId: string;
  text: string;
  keyboard: KeyboardDTO;
};
