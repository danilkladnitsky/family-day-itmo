import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Form extends BaseEntity {
  @Column()
  userId: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  hobies: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
