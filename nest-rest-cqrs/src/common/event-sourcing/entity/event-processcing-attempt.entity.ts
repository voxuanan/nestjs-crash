import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ENUM_EVENT_PROCESSING_STATUS } from '../contants/event-sourcing.enum';

@Entity({ name: 'event-processing' })
export class EventProcessingAttemptEntity extends BaseEntity {
  constructor(partial: Partial<EventProcessingAttemptEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  processorName: string;

  @Column('uuid')
  eventId: string;

  @Column({ type: 'enum', enum: ENUM_EVENT_PROCESSING_STATUS })
  status: ENUM_EVENT_PROCESSING_STATUS;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'date', nullable: true })
  finishedAt?: Date;

  @Column({ type: 'json', nullable: true })
  error?: string;
}
