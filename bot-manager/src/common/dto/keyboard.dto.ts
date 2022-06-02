import { KeyboardTypes } from '../enum/keyboard.types.enum';

export type KeyboardDTO = { data: [KeyboardButtonDTO[]]; type: KeyboardTypes };

export type KeyboardButtonDTO = {
  text: string | number;
  callback_data: string;
  type: 'IN_MESSAGE' | 'STANDALONE';
};
