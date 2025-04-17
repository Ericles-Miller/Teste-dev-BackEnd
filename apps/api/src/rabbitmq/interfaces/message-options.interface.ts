export interface IMessageOptions {
  persistent?: boolean;
  queueName?: string;
  expiration?: string | number;
  priority?: number;
  durable: boolean;
}
