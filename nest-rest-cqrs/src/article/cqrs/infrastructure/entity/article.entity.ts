import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export class ArticleEntity extends BaseEntity {
  constructor(partial: Partial<ArticleEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: String })
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
