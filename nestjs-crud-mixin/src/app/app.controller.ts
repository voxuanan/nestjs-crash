import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CrudControllerMixin } from '../crud/crud.controller';

@Controller()
export class AppController extends CrudControllerMixin(AppService) {}
