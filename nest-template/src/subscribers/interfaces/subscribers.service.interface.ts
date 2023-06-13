import CreateSubscriberDto from '../dto/createSubscriber.dto';
import Subscriber from './subscriber.interface';

interface SubscribersService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>;
  getAllSubscribers(params: {}): Promise<Subscriber>;
}

export default SubscribersService;
