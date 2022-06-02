import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ButtonSize } from 'src/common/enum/button.size.enum';
import { KeyboardTypes } from 'src/common/enum/keyboard.types.enum';
import { Message } from './messages.entity';

@Entity()
export class Link extends BaseEntity {
  @Column({ nullable: false })
  source: number;

  @Column({ nullable: false })
  target: number;

  @Column({ nullable: false })
  trigger: string;

  @Column({ nullable: true })
  label: string;

  @Column({ nullable: true })
  callback_data: string;

  @Column({ default: ButtonSize.FULL })
  size: ButtonSize;

  @Column({ default: KeyboardTypes.STANDALONE })
  type: KeyboardTypes;

  @ManyToMany(() => Message, { cascade: true })
  @JoinTable()
  message: Message;
}
