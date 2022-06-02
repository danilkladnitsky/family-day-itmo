import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { KeyboardTypes } from 'src/common/enum/keyboard.types.enum';
import { Link } from './link.entity';
import { MessageTypes } from 'src/common/enum/types.enum';
import { Trigger } from './triggers.entity';

@Entity()
export class Message extends BaseEntity {
  @ManyToOne(() => Trigger, (trigger) => trigger.message, {
    nullable: true,
  })
  trigger: Trigger;

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  attachedPhotos: string; // todo: add photos

  @ManyToMany(() => Link, { cascade: true })
  @JoinTable()
  link: Link;

  @Column({ default: KeyboardTypes.STANDALONE })
  keyboardtype: KeyboardTypes;

  @Column({ default: MessageTypes.TEXT })
  type: MessageTypes;
}
