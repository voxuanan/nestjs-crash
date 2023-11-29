import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CrudControllerMixin } from 'src/common/crud/crud.controller';

@Controller('app')
export class AppController extends CrudControllerMixin(AppService) {}
