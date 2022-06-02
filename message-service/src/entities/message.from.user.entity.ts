import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity()
export class MessageFromUser extends BaseEntity {
  @Column({ nullable: false })
  userId: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  replyMessage: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  secondName: string;
}
