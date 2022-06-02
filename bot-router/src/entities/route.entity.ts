import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { MessageTypes } from 'src/common/enum/types.enum';

@Entity()
export class RouteEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  microservice: string;

  @Column()
  message_type: MessageTypes;

  @Column()
  pattern: string;

  @Column()
  endpoint: string;
}
