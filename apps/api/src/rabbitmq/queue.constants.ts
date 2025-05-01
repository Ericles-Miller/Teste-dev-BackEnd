import { IQueue } from './interfaces/queue.interface';

export const EXCHANGE_TYPE = 'direct' as const;
export const EXCHANGE_NAME = 'direct_exchange' as const;

export const queues: IQueue[] = [
  {
    name: 'processFile',
    durable: true,
    routingKeys: ['processFile'],
  },
  // {
  //   name: 'uploadFile',
  //   durable: true,
  //   routingKeys: ['UploadFile'],
  // },
];
