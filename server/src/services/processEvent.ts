// ------------------------------------------------------------------------------
// >> EVENT PROCESSOR
// ------------------------------------------------------------------------------
// * This process the error events with Redis (caching)

import connectRedis from '../utils/redisClient';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

const TTL = 7 * 24 * 60 * 60; // Set expiration after 7 day
const maxLength = 1000; // Save amount of records up to 1000

// ------------------------------------------------------------------------------------------------
// * Store Error Events with TTL
// ------------------------------------------------------------------------------------------------
const redisCache = async (topicName: string, event: Record<string, any>) => {
  try {
    const redis = await connectRedis();

    const redisKey = `${topicName}:${uuidv4()}`; // Create unique error key

    await redis.set(redisKey, JSON.stringify(event), { EX: TTL });

    const listKey = `${topicName}`; // Initialize list key
    await redis.lPush(listKey, redisKey); // Save error keys into list

    const currentLength = await redis.lLen(listKey); // Current length of Redis list

    if (currentLength > maxLength) {
        await redis.lTrim(listKey, 0, maxLength - 1); // Resize the length of list
    }

    console.log(chalk.green(`[Redis] Event had been saved under key ${redisKey}.`));
  } catch (error) {
    console.error(chalk.redBright('[Redis] Error storing event: '), error);
  }
};

// ------------------------------------------------------------------------------------------------
// * Query Error Events with Batching
// ------------------------------------------------------------------------------------------------
const queryCache = async(topicName: string, amount=10) => {
    const redis = await connectRedis();

    const listKey = `${topicName}`; // Obtain list key
    const errorKeys = await redis.lRange(listKey, 0, amount - 1); // Error event keys

    // Get the results in batch
    const events = await redis.mGet(errorKeys);
    
    // ? FILTERING
    return events;
}

export default redisCache;
