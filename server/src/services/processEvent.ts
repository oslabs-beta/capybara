// ------------------------------------------------------------------------------
// >> EVENT PROCESSOR
// ------------------------------------------------------------------------------
// * This process the error events with Redis (caching)

import connectRedis from '../utils/redisClient';
import chalk from 'chalk';

const redisCache = async (topicName: string, event: Record<string, any>) => {
  try {
    const redis = await connectRedis();
    const redisKey = `${topicName}`; // Create redis key

    // Store error events into Redis List
    const errorEvent = await redis.rPush(redisKey, JSON.stringify(event));
    console.log(chalk.green(`[Redis] Event had been saved as ${errorEvent}.`));

    // Read all elements from the List
    const events = await redis.lRange(redisKey, 0, -1);
    console.group(chalk.bgMagenta(`[Redis] List: ${events}`))

    // TODO: SET TTL & BATCH QUERY
    
  } catch (error) {
    console.error(chalk.redBright('[Redis] Error storing event: '), error);
  }
};

export default redisCache;
