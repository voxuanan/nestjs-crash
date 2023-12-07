import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JobsModule } from 'src/jobs/jobs.module';
import { RouterModule } from 'src/router/router.module';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        CommonModule,

        // Static file
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', '..', 'data', 'upload'),
            serveRoot: '/upload',
        }),

        // Jobs
        JobsModule.forRoot(),

        // Routes
        RouterModule.forRoot(),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
