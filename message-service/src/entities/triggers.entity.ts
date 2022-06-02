import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Message } from './messages.entity';
import { TriggerTypes } from 'src/common/enum/types.enum';

@Entity()
export class Trigger extends BaseEntity {
  @Column({ nullable: false })
  type: TriggerTypes;

  @Column({ nullable: false })
  value: string;

  @OneToMany(() => Message, (message) => message.trigger)
  message: Message[];
}
