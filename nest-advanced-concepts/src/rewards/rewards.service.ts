import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardsService {
  hello() {
    return 'Hello Lazy Load Module';
  }
}
