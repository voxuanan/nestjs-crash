import { AggregateRoot } from '@nestjs/cqrs';

export type TestEssentialProperties = Readonly<
  Required<{
    id: string;
    name: string;
  }>
>;

export type TestOptionalProperties = Readonly<Partial<{}>>;

export type TestProperties = TestEssentialProperties &
  Required<TestOptionalProperties>;

export interface ITest {
  commit: () => void;
}

export class TestImplement extends AggregateRoot implements ITest {
  private readonly id: string;
  private name: string;
  private mapData: string;

  constructor(properties: TestProperties) {
    super();
    Object.assign(this, properties);
  }
}
