import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'event-sourcing' })
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
