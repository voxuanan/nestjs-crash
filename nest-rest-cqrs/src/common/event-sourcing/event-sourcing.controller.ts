import { Controller, Get, Query } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { prepareEvent } from './contants/event.sourcing.func.contant';
import { EventSouringSearchDto } from './dtos/event-sourcing.search.dto';
import { EventStoreService } from './event-store.service';

@ApiTags('Events')
@Controller('events')
export class EventSourcingController {
  constructor(
    private readonly eventStoreService: EventStoreService,
    private readonly eventBus: EventBus,
  ) {}

  @Get('events')
  getEvent(@Query() query: EventSouringSearchDto): Promise<any[]> {
    return this.eventStoreService.getEvents(query.from);
  }

  @Get('events/retry')
  async retryEvent(@Query() query: EventSouringSearchDto): Promise<void> {
    const eventSources = await this.eventStoreService.getEvents(query.from);
    for (const eventSource of eventSources) {
      this.eventBus.publish(prepareEvent(eventSource));
    }
    return;
  }
}
