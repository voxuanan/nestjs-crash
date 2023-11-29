import { Column, Entity } from 'typeorm';
import { BaseEntityAbstract } from '../../common/entity/abstract/base.entity.abstract';

@Entity({ name: 'apps' })
export class AppEntity extends BaseEntityAbstract {
  constructor(partial: Partial<AppEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ unique: true, nullable: true })
  test?: string;
}
