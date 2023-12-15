import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEventPublisher } from '@nestjs/cqrs/dist/interfaces/events/event-publisher.interface';
import { IEvent } from '@nestjs/cqrs/dist/interfaces/events/event.interface';
import { IMessageSource } from '@nestjs/cqrs/dist/interfaces/events/message-source.interface';
import * as http from 'http';
import { Subject } from 'rxjs';
import * as xml2js from 'xml2js';

/**
 * @class EventStore
 * @description The EventStore.org bridge. By design, the domain category
 * (i.e. user) events are being subscribed to. Upon events being received,
 * internal event handlers are responsible for the handling of events.
 */
export class EventStore implements IEventPublisher, IMessageSource {
  private eventStore: any;
  private eventHandlers: object;
  private category: string;
  private eventStoreHostUrl: string;

  constructor(
    @Inject('EVENT_STORE_PROVIDER') eventStore: any,
    private readonly configService: ConfigService,
  ) {
    this.eventStore = eventStore;
    this.eventStore.connect({
      hostname: this.configService.get<string>('event-store.hostname'),
      port: this.configService.get<string>('event-store.tcpPort'),
      credentials: this.configService.get<string>('event-store.credentials'),
      poolOptions: this.configService.get<string>('event-store.poolOptions'),
    });
    this.eventStoreHostUrl =
      this.configService.get<string>('event-store.protocol') +
      `://${this.configService.get<string>(
        'event-store.hostname',
      )}:${this.configService.get<string>(
        'event-store.credentials.username',
      )}@${this.configService.get<string>(
        'event-store.credentials.password',
      )}:${this.configService.get<string>('event-store.httpPort')}/streams/`;
  }

  async publish<T extends IEvent>(event: T) {
    const message = JSON.parse(JSON.stringify(event));

    const id = message.id;
    const streamName = `${this.category}-${id}`;
    const type = event.constructor.name;
    try {
      await this.eventStore.client.writeEvent(streamName, type, event);
    } catch (err) {
      console.trace(err.message);
    }
  }

  /**
   * @description Event Store bridge subscribes to domain category stream
   * @param subject
   */
  async bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    const streamName = `$ce-${this.category}`;
    const onEvent = async (event) => {
      const eventUrl =
        this.eventStoreHostUrl +
        `${event.metadata.$o}/${event.data.split('@')[0]}`;
      http.get(eventUrl, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          xml2js.parseString(rawData, (err, result) => {
            if (err) {
              console.trace(err);
              return;
            }
            const content = result['atom:entry']['atom:content'][0];
            const eventType = content.eventType[0];
            const data = content.data[0];
            event = this.eventHandlers[eventType](...Object.values(data));
            subject.next(event);
          });
        });
      });
    };
    const onDropped = (subscription, reason, error) => {
      console.trace(subscription, reason, error);
    };
    try {
      await this.eventStore.client.subscribeToStream(
        streamName,
        onEvent,
        onDropped,
        false,
      );
    } catch (err) {
      console.trace(err);
    }
  }

  setEventHandlers(eventHandlers) {
    this.eventHandlers = eventHandlers;
  }

  setCategory(category) {
    this.category = category;
  }
}
