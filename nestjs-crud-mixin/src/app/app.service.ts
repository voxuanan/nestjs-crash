import { Injectable } from '@nestjs/common';
import { AppEntity } from './entities/app.entity';
import { CrudServiceMixin } from 'src/common/crud/crud.service';

@Injectable()
export class AppService extends CrudServiceMixin(AppEntity) {}
