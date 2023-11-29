import { Injectable } from '@nestjs/common';

export abstract class TestService {
  public mutipleTest(i: number): number {
    return i * 2;
  }
}

@Injectable()
export class TestStrategy10 implements TestService {
  public mutipleTest(i: number): number {
    return i * 10;
  }
}

@Injectable()
export class TestStrategy100 implements TestService {
  public mutipleTest(i: number): number {
    return i * 100;
  }
}
