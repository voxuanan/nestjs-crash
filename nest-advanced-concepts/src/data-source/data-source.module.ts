import { Module, Scope } from '@nestjs/common';
import { DataSourceService } from './data-source.service';

@Module({
  providers: [
    DataSourceService,
    //   {
    //   provide: "DATA_SOUCE",
    //   useFactory: (payload) => new DataSourceModule(...),
    //   scope: Scope.REQUEST,
    //   durable: true
    // }
  ],
  exports: [DataSourceService],
})
export class DataSourceModule {}
