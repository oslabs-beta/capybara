// ------------------------------------------------------------------------------
// >> GOOGLE PUB/SUB CLIENT
// ------------------------------------------------------------------------------
// * This file contains the Google Pub/Sub client config and initialization

import { PubSub } from '@google-cloud/pubsub';
import chalk from 'chalk';
import getSecretKeys from '../appSecrets';

const secret = await getSecretKeys(); // Load secrets from Google Secret Manager

if (!secret.GCP_KEY_FILE) {
  throw new Error('GCP_KEY_FILE is not defined in secrets');
}

const pubSubClient = new PubSub({
  projectId: secret.GCP_PROJECT_ID,
  credentials: JSON.parse(secret.GCP_KEY_FILE),
});

const publishToTopic = async (
  topicName: string,
  data: Record<string, any>,
  attributes: Record<string, string>,
) => {
  const topic = pubSubClient.topic(topicName); // Get topic by name
  const messageBuffer = Buffer.from(JSON.stringify(data));

  await topic.publishMessage({ data: messageBuffer, attributes }); // Publish message to topic
  console.group(
    chalk.bgCyanBright(`[PubSub] Message published to ${topicName}`),
  );
  console.log(data); // This will pretty-print the object
  console.groupEnd();
};

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default publishToTopic;
