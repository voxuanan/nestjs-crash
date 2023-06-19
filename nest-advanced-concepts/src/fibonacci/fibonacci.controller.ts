import { Controller, Get, Query } from '@nestjs/common';
import { FibonacciWorkerHost } from './fibonacci-worker.host';
import Piscina from 'piscina';
import { resolve } from 'path';

@Controller('fibonacci')
export class FibonacciController {
  // 1 Worker
  //   constructor(private readonly fibonacciWokerHost: FibonacciWorkerHost) {}

  // Pool Worker with Piscina
  fibonacciWoker = new Piscina({
    filename: resolve(__dirname, 'fibonacci.worker.js'),
  });
  @Get()
  fibonaccy(@Query('n') n = 10) {
    // return this.fibonacciWokerHost.run(n);
    return this.fibonacciWoker.run(n);
  }
}
