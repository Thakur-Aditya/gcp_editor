// /lib/redis.js
import Queue from "bull";

const REDIS_URL = process.env.NEXT_PUBLIC_REDIS_URL;

const productionOptions = {
  redis: {
    tls: true,
    enableTLSForSentinelMode: false,
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    connectTimeout: 30000,
    disconnectTimeout: 2000,
  },
};

const developmentOptions = {
  redis: {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
  },
};

export const createQueue = () => {
  if (!REDIS_URL) {
    throw new Error("Redis URL not configured");
  }

  const options =
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? productionOptions
      : developmentOptions;

  return new Queue("imageProcessing", REDIS_URL, {
    ...options,
    defaultJobOptions: {
      removeOnComplete: true,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    },
  });
};
