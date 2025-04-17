import { IMessageOptions } from './message-options.interface';

export interface IPublishMessage {
  routingKey: string;
  message: string;
  options?: IMessageOptions;
}
