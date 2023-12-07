import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsRouterModule } from './router/jobs.router.module';
import { JobUserService } from './services/jobs.user.service';
import { UserModule } from 'src/modules/user/user.module';
import { JobSavedSearchService } from './services/jobs.saved-search.service';

@Module({})
export class JobsModule {
    static forRoot(): DynamicModule {
        const imports: (
            | DynamicModule
            | Type<any>
            | Promise<DynamicModule>
            | ForwardReference<any>
        )[] = [];
        const providers = [];
        const exports = [];

        if (process.env.JOB_ENABLE === 'true') {
            imports.push(
                ScheduleModule.forRoot(),
                JobsRouterModule,
                UserModule,
            );
            providers.push(JobUserService, JobSavedSearchService);
            exports.push(JobUserService, JobSavedSearchService);
        }

        return {
            module: JobsModule,
            providers,
            exports,
            controllers: [],
            imports,
        };
    }
}
