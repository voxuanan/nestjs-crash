import { Module } from '@nestjs/common';
import { MailModule } from 'src/common/mail/mail.module';
import { PropertyModule } from '../property/property.module';
import { UserModule } from '../user/user.module';
import { SavedSearchService } from './services/saved-search.service';
import { BullModule } from '@nestjs/bull';
import {
    SAVED_SEARCH_QUEUE,
    SAVED_SEARCH_QUEUE_QUEUE_LIMITTER_DURATION,
    SAVED_SEARCH_QUEUE_QUEUE_LIMITTER_MAX,
} from './constants/saved-search.queue.constant';
import { SavedSeachConsumer } from './processors/saved-search.procesor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: SAVED_SEARCH_QUEUE,
            limiter: {
                max: SAVED_SEARCH_QUEUE_QUEUE_LIMITTER_MAX,
                duration: SAVED_SEARCH_QUEUE_QUEUE_LIMITTER_DURATION,
            },
        }),
        PropertyModule,
        UserModule,
        MailModule,
    ],
    controllers: [],
    providers: [SavedSearchService, SavedSeachConsumer],
    exports: [SavedSearchService, SavedSeachConsumer],
})
export class SavedSearchModule {}
