import { createClient } from 'redis';
import chalk, { Chalk } from 'chalk';
import getSecretKeys from '../appSecrets';

const connectRedis = async () => {
  const { REDIS_URL } = await getSecretKeys(); // Get saved URL from secrete manager

  if (!REDIS_URL) {
    throw new Error('REDIS_URL is not defined in secrets');
  }

  const redisClient = createClient({ url: REDIS_URL }); 

  // Listen for connection error event asynchronously
  redisClient.on('error', (err) => {
    console.error(chalk.green('Redis Client Error', err));
  });

  await redisClient.connect();
  console.log(chalk.green('[Redis] You are connected to Redis Cloud now.'));

  return redisClient;
};

export default connectRedis;

// * Testing example
// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result); // >>> bar
