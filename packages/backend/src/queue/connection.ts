import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { config } from '../config/index.js';

// Parse Redis URL to extract password if present
const redisUrl = new URL(config.REDIS_URL);
const redisOptions: any = {
  maxRetriesPerRequest: null,
};

// Add password if present in URL
if (redisUrl.password) {
  redisOptions.password = redisUrl.password;
}

export const connection = new Redis(config.REDIS_URL, redisOptions);

// Create a dedicated publisher connection for pub/sub
export const publisher = new Redis(config.REDIS_URL, redisOptions);

export function createQueue<T = any>(name: string) {
  return new Queue<T>(name, { connection });
}

export function createWorker<T = any>(
  name: string,
  processor: (job: any) => Promise<void>
) {
  return new Worker<T>(name, processor, { connection });
}
