// /lib/redis.js
import Queue from 'bull';

const REDIS_URL = process.env.REDIS_URL;

const productionOptions = {
    redis: {
        tls: true,
        enableTLSForSentinelMode: false,
        maxRetriesPerRequest: 3,
        enableReadyCheck: false,
        connectTimeout: 30000,
        disconnectTimeout: 2000,
    }
};

const developmentOptions = {
    redis: {
        maxRetriesPerRequest: 3,
        enableReadyCheck: false,
    }
};

export const createQueue = () => {
    const options = process.env.NODE_ENV === 'production' ? productionOptions : developmentOptions;
    
    return new Queue('imageProcessing', REDIS_URL, {
        ...options,
        defaultJobOptions: {
            removeOnComplete: true,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            }
        }
    });
};