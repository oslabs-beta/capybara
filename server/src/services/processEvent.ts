// ------------------------------------------------------------------------------
// >> EVENT PROCESSOR
// ------------------------------------------------------------------------------
// * This process the error events with Redis (caching)
import connectRedis from '../utils/redisClient';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

const TTL = 7 * 24 * 60 * 60; // Set expiration after 7 day
const maxLength = 5; // Save amount of records up to 1000
const dedupTTL = 60; // 1 minute deduplication window

// ------------------------------------------------------------------------------------------------
// * Store Error Events with TTL
// ------------------------------------------------------------------------------------------------
const redisCache = async (topicName: string, event: Record<string, any>) => {
  try {
    const redis = await connectRedis();
    console.log(
      chalk.bgGreenBright('[Redis] You are connected to Redis Cloud now.'),
    );

    const redisKey = `${topicName}:${uuidv4()}`; // Create unique error key

    await redis.set(redisKey, JSON.stringify(event), { EX: TTL });

    const listKey = `${topicName}`; // Initialize list key
    await redis.lPush(listKey, redisKey); // Save error keys into list

    const currentLength = await redis.lLen(listKey); // Current length of Redis list

    if (currentLength > maxLength) {
      await redis.lTrim(listKey, 0, maxLength - 1); // Resize the length of list
    }

    // Testing: GET event from the list
    const k8sevent = await redis.get(redisKey);

    console.log(
      chalk.bgMagentaBright(
        `[Redis] Event ${k8sevent} had been saved under key ${redisKey}.`,
      ),
    );
  } catch (error) {
    console.error(chalk.redBright('[Redis] Error storing event: '), error);
  }
};

// ------------------------------------------------------------------------------------------------
// * Deduplication
// ------------------------------------------------------------------------------------------------
const isDuplicateEvent = async (
  namespace: string,
  pod: string,
  reason: string,
  TTL = dedupTTL,
): Promise<boolean> => {
  try {
    const redis = await connectRedis();
    const dedupKey = `event:${namespace}:${pod}:${reason}`;
    const exists = await redis.get(dedupKey);
    if (exists) {
      return true;
    }
    await redis.set(dedupKey, '0', { EX: TTL }); // Cache dedup key
    return false;
  } catch (err) {
    console.error(chalk.red(`[Redis] Deduplication error:`), err);
    return false; // Fail open (assume not duplicate)
  }
};

// TODO: Probably can adopt into somewhere in data flow
// ------------------------------------------------------------------------------------------------
// * Query Error Events with Batching
// ------------------------------------------------------------------------------------------------
const queryCache = async (topicName: string, amount = 10) => {
  const redis = await connectRedis();

  const listKey = `${topicName}`; // Obtain list key
  const errorEvents = await redis.lRange(listKey, 0, amount - 1); // Error event keys

  // Get the results in batch
  const events = await redis.mGet(errorEvents);

  return events;
};

export { redisCache, queryCache, isDuplicateEvent };
