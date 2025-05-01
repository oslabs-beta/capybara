import { createClient } from 'redis';
import chalk, { Chalk } from 'chalk';
import getSecretKeys from '../appSecrets';

// Initialize redisClient to null 
let redisClient: ReturnType<typeof createClient> | null = null;

const connectRedis = async () => {
  if (redisClient && redisClient.isOpen) return redisClient;
  console.log(chalk.bgYellowBright(`[REDIS] CONNECTION PORT EXISTING`));

  const { REDIS_URL } = await getSecretKeys(); // Get saved URL from secrete manager

  if (!REDIS_URL) {
    throw new Error('REDIS_URL is not defined in secrets');
  }

  redisClient = createClient({ url: REDIS_URL }); 


  redisClient.on('error', (err) => {
    console.error(chalk.bgRedBright('[Redis] Client ', err));
  });

  await redisClient.connect();

  return redisClient;
};

export default connectRedis;

// * Testing example
// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result); // >>> bar
