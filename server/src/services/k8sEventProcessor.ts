// ------------------------------------------------------------------------------
// >> KUBERNETES EVENT PROCESSOR
// ------------------------------------------------------------------------------
// * This file processes Kubernetes error events from Pub/Sub, embeds them,
// * stores them in Pinecone, queries for similar events, generates AI responses,
// * and sends notifications to Slack.

import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import { subscribeToTopic, createSubscription } from '../utils/pubsubClient';
import generateEmbedding from '../utils/geminiEmbeddingClient';
import pineconeVector from '../utils/pineconeClient';
import gemini from '../utils/geminiClient';
import slack_message from '../utils/slackClient';

// ! Prevent processing of past events and throttle Slack notifications !
const SUBSCRIPTION_START_TIME = Date.now();
const RATE_LIMIT_INTERVAL = 60 * 15 * 1000; // 15 minutes

let lastNotificationTime = 0;

// Define K8s event type
interface K8sEvent {
  reason: string;
  message: string;
  pod: string;
  namespace: string;
  timestamp: string;
}

// Define embedding event type
interface K8sEventEmbedding {
  id: string;
  values: number[];
  metadata: {
    namespace: string;
    kind: string;
    name: string;
    reason: string;
    message: string;
    timestamp: string;
    [key: string]: any;
  };
}

// ------------------------------------------------------------------------------
// * K8s EVENT PROCESSOR
// ------------------------------------------------------------------------------
const processK8sEvent = async (
  eventData: any,
  attributes: Record<string, string> = {},
) => {
  try {
    console.log(
      chalk.bgMagenta('[K8sProcessor] Processing new Kubernetes error event'),
    );

    // 1. Parse the event data
    const event = parseEventData(eventData);
    console.log(chalk.cyan('[K8sProcessor] Parsed event:'), event);

    const eventTime = new Date(event.timestamp).getTime();
    if (eventTime < SUBSCRIPTION_START_TIME) {
      console.log(chalk.yellow('[K8sProcessor] Skipping past event'));
      return;
    }

    // 2. Create embedding for the event text
    const embeddingText: string = createEmbeddingText(event);
    console.log(
      chalk.cyan('[K8sProcessor] Generated embedding text:'),
      embeddingText,
    );

    const vector = await generateEmbedding(embeddingText);
    // console.log(
    //   chalk.cyan('[K8sProcessor] Generated embedding vector of length:'),
    //   vector ? vector.length : 'undefined',
    // );

    // 3. Prepare event embedding for Pinecone
    const eventEmbedding = createEventEmbedding(event, vector || []);
    console.log(
      chalk.cyan('[K8sProcessor] Created event embedding with ID:'),
      eventEmbedding.id,
    );

    // 4. Get Pinecone client and upsert the embedding
    const pinecone = await pineconeVector();
    await pinecone.upsertEvent(eventEmbedding);

    // 5. Query Pinecone for similar events
    const filter = pinecone.createNamespaceFilter(event.namespace);
    const similarEvents = await pinecone.querySimilarEvents(vector || [], {
      topK: 10,
      filter,
      includeMetadata: true,
    });

    console.log(
      chalk.cyan('[K8sProcessor] Found similar events:'),
      similarEvents.matches.length,
    );

    // 6. Build context prompt with similar events for AI
    const prompt = buildContextPrompt(event, similarEvents);
    console.log(chalk.cyan('[K8sProcessor] Built AI prompt'));

    // 7. Get AI response from Gemini
    const aiResponse = await gemini(prompt);
    console.log(chalk.cyan('[K8sProcessor] Received AI response'));

    // 8. Format and send Slack notification (with rate limiting)
    const slackMessage = formatSlackMessage(event, aiResponse, similarEvents);
    const now = Date.now();
    if (now - lastNotificationTime >= RATE_LIMIT_INTERVAL) {
      await slack_message(slackMessage);
      lastNotificationTime = now;
      console.log(
        chalk.green('[K8sProcessor] Successfully sent message to Slack'),
      );
    } else {
      console.log(
        chalk.yellow(
          '[K8sProcessor] Rate limit reached, skipping Slack notification',
        ),
      );
    }

    return;
  } catch (error) {
    console.error(chalk.red('[K8sProcessor] Error processing event:'), error);
    throw error;
  }
};

// ------------------------------------------------------------------------------
// * HELPER FUNCTIONS
// ------------------------------------------------------------------------------

// Parse the event data from PubSub
const parseEventData = (data: any): K8sEvent => {
  // Ensure all required fields are present
  const event: K8sEvent = {
    reason: data.reason || 'Unknown',
    message: data.message || 'No message provided',
    pod: data.pod || 'unknown-pod',
    namespace: data.namespace || 'default',
    timestamp: data.timestamp || new Date().toISOString(),
  };

  return event;
};

// Create text for embedding generation
const createEmbeddingText = (event: K8sEvent): string => {
  return `Kubernetes Error Event:
Reason: ${event.reason}
Pod: ${event.pod}
Namespace: ${event.namespace}
Message: ${event.message}`;
};

// Create event embedding object for Pinecone
const createEventEmbedding = (
  event: K8sEvent,
  vector: number[],
): K8sEventEmbedding => {
  return {
    id: uuidv4(), // Generate a unique ID for this event
    values: vector,
    metadata: {
      namespace: event.namespace,
      kind: 'Pod', // Assuming all events are from pods
      name: event.pod,
      reason: event.reason,
      message: event.message,
      timestamp: event.timestamp,
    },
  };
};

// Build context prompt with similar events for AI
const buildContextPrompt = (event: K8sEvent, similarEvents: any): string => {
  // Start with the main event details
  let prompt = `You are a Kubernetes expert tasked with troubleshooting Kubernetes errors.

CURRENT ERROR EVENT:
- Reason: ${event.reason}
- Pod: ${event.pod}
- Namespace: ${event.namespace}
- Timestamp: ${event.timestamp}
- Message: ${event.message}

`;

  // Include similar past events if available
  if (similarEvents.matches && similarEvents.matches.length > 0) {
    prompt += `\nSIMILAR PAST EVENTS (${Math.min(5, similarEvents.matches.length)} most similar):\n`;

    // Include up to 5 similar events
    const eventsToInclude = similarEvents.matches.slice(0, 5);
    eventsToInclude.forEach((match: any, index: number) => {
      if (match.metadata) {
        prompt += `\nSimilar Event #${index + 1} (similarity score: ${match.score.toFixed(2)}):
- Reason: ${match.metadata.reason || 'Unknown'}
- Pod: ${match.metadata.name || 'Unknown'}
- Namespace: ${match.metadata.namespace || 'Unknown'}
- Message: ${match.metadata.message || 'No message available'}
- Timestamp: ${match.metadata.timestamp || 'Unknown'}\n`;
      }
    });
  } else {
    prompt += '\nNo similar past events found in the database.\n';
  }

  // Add instructions for the AI
  prompt += `
Please respond with a concise Slack-formatted message using the exact layout below. Use real line breaks (no literal "\\n") and add two spaces at the end of each line to enforce Slack formatting. The AI Powered recommendation should take into consideration any similar events in the past to provide a solid resolution to fix the Kubernetes issue using best practice. Include a blank line between each section:

:fire: *Anomaly Details*  
{Anomaly Details}  

:bar_chart: *Observed Value*  
{Observed Value}  

:chart_with_upwards_trend: *Threshold Breached*  
{Threshold Breached}  

:mag: *Root-Cause Analysis*  
{Root-Cause Analysis}  

:open_file_folder: *Historic Trends (Pinecone)*  
{Historic Trends}  

:star: *AI Powered Recommendations*  
• {Recommendation 1}  
• {Recommendation 2}
`;

  return prompt;
};

// ------------------------------------------------------------------------------
// * SEND MESSAGE TO SLACK
// ------------------------------------------------------------------------------
// Format Slack message with event details and AI response
const formatSlackMessage = (
  event: K8sEvent,
  aiResponse: string,
  similarEvents: any,
): string => {
  const similarEventCount = similarEvents.matches
    ? similarEvents.matches.length
    : 0;

  return `:bangbang: *Kubernetes Anomaly Detected* :bangbang:
  

*Event Details:*
• *Reason:* ${event.reason}
• *Pod:* ${event.pod}
• *Namespace:* ${event.namespace}
• *Time:* ${new Date(event.timestamp).toLocaleString()}


*Error Message:*
\`\`\`
${event.message}
\`\`\`


*AI Analysis and Resolution:*
${aiResponse}


${similarEventCount > 0 ? `_Note: Found ${similarEventCount} similar past events that informed this analysis._` : '_Note: No similar past events found in the database._'}`;
};

// ------------------------------------------------------------------------------
// * START SUBSCRIPTION TO PUBSUB TOPIC
// ------------------------------------------------------------------------------
const startK8sEventProcessor = async () => {
  const topicName = 'kubernetes-error-events-oom-crashloop';
  const subscriptionName = 'k8s-event-processor-subscription';

  try {
    console.log(
      chalk.bgBlue(`[K8sProcessor] Starting Kubernetes event processor`),
    );

    // First, ensure the subscription exists
    console.log(
      chalk.blue(
        `[K8sProcessor] Ensuring subscription exists for topic: ${topicName}`,
      ),
    );

    // Create the subscription if it doesn't exist
    await createSubscription(topicName, subscriptionName, {
      expirationPolicy: { ttl: { seconds: 31536000 } }, // 1 year
      messageRetentionDuration: { seconds: 604800 }, // 7 days
      retainAckedMessages: false,
    });

    console.log(
      chalk.blue(
        `[K8sProcessor] Subscription confirmed, now subscribing to: ${topicName}`,
      ),
    );

    // Now subscribe to the PubSub topic
    const subscription = await subscribeToTopic(
      subscriptionName,
      processK8sEvent,
    );

    console.log(
      chalk.green(
        `[K8sProcessor] Successfully subscribed to ${subscriptionName}`,
      ),
    );
    console.log(
      chalk.green(`[K8sProcessor] Waiting for Kubernetes error events...`),
    );

    // Keep the process running
    return new Promise(() => {
      console.log(
        chalk.green(`[K8sProcessor] Process will stay alive to process events`),
      );

      // Setup handler for graceful shutdown
      process.on('SIGINT', () => {
        console.log(
          chalk.yellow(`[K8sProcessor] Received SIGINT, shutting down...`),
        );
        if (subscription) {
          subscription.removeAllListeners();
        }
        console.log(chalk.yellow(`[K8sProcessor] Goodbye!`));
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(
      chalk.bgRed(`[K8sProcessor] Error initializing processor:`),
      error,
    );

    // Retry after delay
    console.log(chalk.yellow(`[K8sProcessor] Retrying in 5 seconds...`));
    setTimeout(() => startK8sEventProcessor(), 5000);
  }
};

// ------------------------------------------------------------------------------
// >> EXPORT MODULES
// ------------------------------------------------------------------------------
export { startK8sEventProcessor, processK8sEvent };
export default startK8sEventProcessor;
