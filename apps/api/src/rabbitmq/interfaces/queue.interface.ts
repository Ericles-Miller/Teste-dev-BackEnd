export interface IQueue {
  name: string;
  durable: boolean;
  routingKeys: string[];
}
