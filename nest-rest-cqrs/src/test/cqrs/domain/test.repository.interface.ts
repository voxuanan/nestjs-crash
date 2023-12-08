import { ITest } from './test.interface';

export interface ITestRepository {
  newId: () => Promise<string>;
  save: (test: ITest | ITest[]) => Promise<void>;
  findById: (id: string) => Promise<ITest | null>;
  findByName: (name: string) => Promise<ITest[]>;
}
