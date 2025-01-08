import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 100, // Max retries per request set karna
  retryStrategy: (times) => {
    // Reconnect hone ka time
    return Math.min(times * 50, 2000);
  },
});

export default redis;