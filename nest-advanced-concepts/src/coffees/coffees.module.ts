import { Module } from '@nestjs/common';
import { COFFEES_DATA_SOURCE, CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Coffee } from './entities/coffee.entity';

@Module({
  controllers: [CoffeesController],
  providers: [
    Coffee,
    CoffeesService,
    {
      provide: COFFEES_DATA_SOURCE,
      useValue: [],
    },
  ],
})
export class CoffeesModule {}
