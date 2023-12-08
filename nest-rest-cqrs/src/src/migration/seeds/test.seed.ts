import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { TestRepository } from 'src/test/cqrs/infrastructure/repository/test.repository';
import {
  CreateTestOptions,
  TestFactory,
} from 'src/test/cqrs/domain/test.factory';

@Injectable()
export class MigrationTestSeed {
  constructor(
    private readonly testFactory: TestFactory,
    private readonly testRepository: TestRepository,
  ) {}
  @Command({
    command: 'insert:test',
    describe: 'insert test',
  })
  async insert(): Promise<void> {
    const articles: CreateTestOptions[] = [
      {
        id: '1',
        name: 'string1',
        mapData: 'test1',
      },
      {
        id: '2',
        name: 'string2',
        mapData: 'test2',
      },
      {
        id: '3',
        name: 'string3',
        mapData: 'test3',
      },
      {
        id: '0',
        name: 'string',
        mapData: 'Anh An Dep Trai Vo Dich Vu Tru, aaaaaaaaaaa em ra em ra',
      },
    ];
    try {
      for (const article of articles) {
        const test = this.testFactory.create(article);
        await this.testRepository.save(test);
      }
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:test',
    describe: 'remove test',
  })
  async remove(): Promise<void> {
    try {
      // Remove test
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
