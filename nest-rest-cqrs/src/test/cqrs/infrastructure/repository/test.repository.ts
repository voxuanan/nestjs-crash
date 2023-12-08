import { TestFactory } from 'src/test/cqrs/domain/test.factory';
import { TestProperties, ITest } from 'src/test/cqrs/domain/test.interface';
import { ITestRepository } from 'src/test/cqrs/domain/test.repository.interface';
import { writeConnection } from 'src/common/common.module';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { TestEntity } from '../entity/test.entity';
import { Inject } from '@nestjs/common';

export class TestRepository implements ITestRepository {
  @Inject()
  private readonly testFactory: TestFactory;
  @Inject() private readonly helperStringService: HelperStringService;

  async newId(): Promise<string> {
    return this.helperStringService.random(16);
  }

  async save(data: ITest | ITest[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeConnection.manager.getRepository(TestEntity).save(entities);
  }

  async findById(id: string): Promise<ITest | null> {
    const entity = await writeConnection.manager
      .getRepository(TestEntity)
      .findOneBy({ id: id });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByName(name: string): Promise<ITest[]> {
    const entities = await writeConnection.manager
      .getRepository(TestEntity)
      .findBy({ name });
    return entities.map((entity) => this.entityToModel(entity));
  }

  private modelToEntity(model: ITest): TestEntity {
    const properties = JSON.parse(JSON.stringify(model)) as TestProperties;
    return new TestEntity({
      ...properties,
      id: properties.id,
    });
  }

  private entityToModel(entity: TestEntity): ITest {
    return this.testFactory.reconstitute({
      ...entity,
      id: entity.id,
    });
  }
}
