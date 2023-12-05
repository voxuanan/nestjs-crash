import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EventProcessingAttemptEntity } from './event-processcing-attempt.entity';

@Entity()
export class EventSourcingEntity extends BaseEntity {
  constructor(partial: Partial<EventSourcingEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name: string;

  @Column({ type: 'json' })
  data: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
