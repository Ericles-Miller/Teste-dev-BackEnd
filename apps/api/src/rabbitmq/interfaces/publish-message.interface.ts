import { IMessageOptions } from './message-options.interface';

export interface IPublishMessage {
  routingKey: string;
  message: any;
  options?: IMessageOptions;
}
