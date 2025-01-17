import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  queue: process.env.QUEUE,
  queueUrl: process.env.AWS_QUEUE_URL,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
