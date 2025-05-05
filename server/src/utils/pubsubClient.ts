// ------------------------------------------------------------------------------
// >> GOOGLE PUB/SUB CLIENT
// ------------------------------------------------------------------------------
// * This file contains the Google Pub/Sub client config and initialization

import { PubSub, Subscription } from '@google-cloud/pubsub';
import chalk from 'chalk';
import getSecretKeys from '../appSecrets';
import { subscribe } from 'diagnostics_channel';
import { queryCache, redisCache } from '../services/processEvent';

const secret = await getSecretKeys(); // Load secrets from Google Secret Manager

if (!secret.GCP_KEY_FILE) {
  throw new Error('GCP_KEY_FILE is not defined in secrets');
}

const pubSubClient = new PubSub({
  projectId: secret.GCP_PROJECT_ID,
  credentials: JSON.parse(secret.GCP_KEY_FILE),
});

// ------------------------------------------------------------------------------------------------
// * PUBLISH TO TOPIC * //
// ------------------------------------------------------------------------------------------------
const publishToTopic = async (
  topicName: string,
  data: Record<string, any>,
  attributes: Record<string, string> = {}, // Make attributes optional with default empty object
) => {
  if (!topicName) {
    throw new Error('Topic name is required for publishToTopic');
  }

  if (!data) {
    throw new Error('Data object is required for publishToTopic');
  }

  const topic = pubSubClient.topic(topicName); // Get topic by name
  const messageBuffer = Buffer.from(JSON.stringify(data));

  const messageId = await topic.publishMessage({
    data: messageBuffer,
    attributes,
  }); // Publish message to topic

  console.group(
    chalk.bgCyanBright(`[PubSub] Message published to ${topicName}`),
  );

  // * Add the function of saving data into Redis
  await redisCache(topicName, data);
  // await queryCache(topicName);

  console.log(data); // This will pretty-print the object
  console.groupEnd();

  return messageId;
};

// ------------------------------------------------------------------------------------------------
// * SUBSCRIBE TO TOPIC * //
// ------------------------------------------------------------------------------------------------
const subscribeToTopic = async (
  subscriptionName: string,
  messageHandler: (
    message: any,
    attributes: Record<string, string>,
  ) => Promise<void>,
  options: {
    flowControl?: { maxMessages?: number };
    autoAck?: boolean;
  } = { autoAck: true },
) => {
  if (!subscriptionName) {
    throw new Error('Subscription name is required for subscribeToTopic');
  }

  try {
    const subscription = pubSubClient.subscription(subscriptionName, {
      flowControl: options.flowControl || { maxMessages: 10 },
    });

    console.group(
      chalk.bgMagentaBright(`[PubSub] Subscribing to ${subscriptionName}`),
    );

    subscription.on('message', async (message) => {
      try {
        const data = JSON.parse(message.data.toString());
        const attributes = message.attributes || {};

        console.log(
          chalk.greenBright(
            `[PubSub] Message received from ${subscriptionName}:`,
          ),
        );
        console.log(data);

        await messageHandler(data, attributes); // Call the message handler w/ parsed data

        if (options.autoAck !== false) {
          message.ack(); // Acknowledge the message if autoAck is true
          console.log(chalk.greenBright('[PubSub] Message acknowledged'));
        }
      } catch (error) {
        console.error(
          chalk.redBright(
            `[PubSub] Error processing message from ${subscriptionName}:`,
          ),
          error,
        );
        message.nack(); // Nack is called if there's an error to retry the message
      }
    });

    subscription.on('error', (error) => {
      console.error(
        chalk.redBright(`[PubSub] Subscription error w/ ${subscriptionName}:`),
        error,
      );
    });

    console.log(
      chalk.greenBright(
        `[PubSub] Successfully subscribed to ${subscriptionName}`,
      ),
    );
    console.groupEnd();
    return subscription;
  } catch (error) {
    console.error(
      chalk.redBright(
        `[PubSub] Failed to subscribe to ${subscriptionName}:`,
        error,
      ),
    );
    throw error;
  }
};

// ------------------------------------------------------------------------------------------------
// * CREATE SUBSCRIPTION * //
// ------------------------------------------------------------------------------------------------
const createSubscription = async (
  topicName: string,
  subscriptionName: string,
  options: {
    expirationPolicy?: { ttl: { seconds: number } };
    messageRetentionDuration?: { seconds: number };
    retainAckedMessages?: boolean;
  } = {},
) => {
  try {
    const topic = pubSubClient.topic(topicName);
    const [subscriptionExists] = await pubSubClient
      .subscription(subscriptionName)
      .exists();

    if (!subscriptionExists) {
      console.log(
        chalk.yellowBright(
          `[PubSub] Creating subscription ${subscriptionName} for topic ${topicName}`,
        ),
      );

      const [subscription] = await topic.createSubscription(subscriptionName, {
        expirationPolicy: options.expirationPolicy || {
          ttl: { seconds: 31536000 },
        }, // 1 year
        messageRetentionDuration: options.messageRetentionDuration || {
          seconds: 604800,
        }, // 7 days
        retainAckedMessages: options.retainAckedMessages || false,
      });

      console.log(
        chalk.greenBright(
          `[PubSub] Subscription ${subscriptionName} created successfully`,
        ),
      );
      return subscription;
    }

    console.log(
      chalk.blueBright(
        `[PubSub] Subscription ${subscriptionName} already exists`,
      ),
    );
    return pubSubClient.subscription(subscriptionName); // Return existing subscription
  } catch (error) {
    console.error(
      chalk.redBright(
        `[PubSub] Failed to create subscription ${subscriptionName}:`,
        error,
      ),
    );
    throw error;
  }
};

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export { subscribeToTopic, createSubscription };
export default publishToTopic;
