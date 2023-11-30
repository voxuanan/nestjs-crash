import { Global, Module } from '@nestjs/common';
import { HelperArrayService } from './services/helper.array.service';
import { HelperDateService } from './services/helper.date.service';
import { HelperFileService } from './services/helper.file.service';
import { HelperHashService } from './services/helper.hash.service';
import { HelperNumberService } from './services/helper.number.service';
import { HelperStringService } from './services/helper.string.service';

@Global()
@Module({
  providers: [
    HelperArrayService,
    HelperDateService,
    HelperHashService,
    HelperNumberService,
    HelperStringService,
    HelperFileService,
  ],
  exports: [
    HelperArrayService,
    HelperDateService,
    HelperHashService,
    HelperNumberService,
    HelperStringService,
    HelperFileService,
  ],
  controllers: [],
  imports: [],
})
export class HelperModule {}
