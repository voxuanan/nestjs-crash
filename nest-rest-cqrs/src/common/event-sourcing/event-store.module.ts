import { Global, Module, DynamicModule } from '@nestjs/common';
import { eventStoreProviders } from './event-store.provider';
import { EventStore } from './event-store';

@Module({
  providers: [
    ...eventStoreProviders,
    {
      provide: 'EVENT_STORE_CONFIG',
      useValue: 'EVENT_STORE_CONFIG_USE_ENV',
    },
  ],
  exports: [
    ...eventStoreProviders,
    {
      provide: 'EVENT_STORE_CONFIG',
      useValue: 'EVENT_STORE_CONFIG_USE_ENV',
    },
  ],
})
export class EventStoreModule {
  static forRoot(): DynamicModule {
    return {
      module: EventStoreModule,
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: EventStoreModule,
      providers: [EventStore],
      exports: [EventStore],
    };
  }
}
