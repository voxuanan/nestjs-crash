import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tests' })
export class TestEntity extends BaseEntity {
  constructor(partial: Partial<TestEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: String })
  id: string;

  @Column()
  name: string;

  @Column('json')
  mapData: string;
}
