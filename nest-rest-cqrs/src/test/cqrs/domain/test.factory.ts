import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { TestImplement, TestProperties, ITest } from './test.interface';

export type CreateTestOptions = Readonly<{
  id: string;
  name: string;
  mapData: string;
}>;

export class TestFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateTestOptions): ITest {
    return this.eventPublisher.mergeObjectContext(
      new TestImplement({
        ...options,
      }),
    );
  }

  reconstitute(properties: TestProperties): ITest {
    return this.eventPublisher.mergeObjectContext(
      new TestImplement(properties),
    );
  }
}
