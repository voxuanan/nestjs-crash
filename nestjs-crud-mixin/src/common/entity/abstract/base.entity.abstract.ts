import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntityAbstract extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt?: Date;

  @UpdateDateColumn({
    nullable: true,
    name: 'created_at',
  })
  createdAt?: Date;
}
