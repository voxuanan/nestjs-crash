import { BullModule } from '@nestjs/bull';
import { Module, forwardRef } from '@nestjs/common';
import {
    PROPERTY_QUEUE,
    PROPERTY_QUEUE_QUEUE_LIMITTER_DURATION,
    PROPERTY_QUEUE_QUEUE_LIMITTER_MAX,
} from './constants/property.queue.constant';
import { PropertyConsumer } from './processors/property.procesor';
import { PropertyService } from './services/property.service';
import { PropertyPulicController } from './controllers/property.public.controller';
import { SavedSearchModule } from '../saved-search/saved-search.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: PROPERTY_QUEUE,
            limiter: {
                max: PROPERTY_QUEUE_QUEUE_LIMITTER_MAX,
                duration: PROPERTY_QUEUE_QUEUE_LIMITTER_DURATION,
            },
        }),
        forwardRef(() => SavedSearchModule),
    ],
    controllers: [PropertyPulicController],

    providers: [PropertyConsumer, PropertyService],
    exports: [PropertyConsumer, PropertyService],
})
export class PropertyModule {}
