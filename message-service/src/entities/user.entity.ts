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
import { Form } from './forms.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  userId: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  languageCode: string;

  @OneToOne(() => Form)
  form: Form;

  @Column({ nullable: true })
  feedback: string;
}
