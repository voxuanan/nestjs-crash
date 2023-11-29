import { Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface ICrudService<T extends any> {
  get(id: number): Promise<T>;
  list(): Promise<T[]>;
  create(data: T): Promise<T>;
  update(id: number, data: T): Promise<T>;
  delete(id: number): Promise<T>;
}

export function CrudServiceMixin(entity: any): Type<ICrudService<any>> {
  class CrudControllerHost {
    @InjectRepository(entity)
    private crudRepository: Repository<any>;

    get(id: number) {
      return this.crudRepository.findOneBy({ id });
    }

    list() {
      return this.crudRepository.find();
    }

    create(data: any) {
      return this.crudRepository.save(data);
    }

    update(id: number, data: any) {
      return this.crudRepository.update(id, data);
    }

    delete(id: number) {
      return this.crudRepository.delete(id);
    }
  }

  return CrudControllerHost;
}
