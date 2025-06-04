// ------------------------------------------------------------------------------
// >> KUBERNETES EVENT WATCHER
// ------------------------------------------------------------------------------
// * This listens for Kubernetes events and publishes them to a Google Pub/Sub topic

import * as k8s from '@kubernetes/client-node';
import publishToTopic from '../utils/pubsubClient';
import { isDuplicateEvent } from './processEvent';
import chalk from 'chalk';

// Helper function to add timestamps to logs
const timestamp = () => {
  const now = new Date();
  return `[${now.toISOString()}]`;
};

const topicName = 'kubernetes-error-events-oom-crashloop'; // !! Pub/Sub topic name.. testing this one !!

const startK8sEventWatcher = async () => {
  try {
    const kc = new k8s.KubeConfig(); // Load the kubeconfig file
    kc.loadFromDefault(); // uses ~/.kube/config or KUBECONFIG env

    const watch = new k8s.Watch(kc);

    console.log(chalk.bgBlueBright(`[K8sWatcher] K8s event watcher started`));
    console.log(
      chalk.blue(`[K8sWatcher] Watching for events on topic: ${topicName}`),
    );

    // Counter to track events
    let totalEventsReceived = 0;
    let errorEventsDetected = 0;
    let publishedEvents = 0;

    await watch.watch(
      '/api/v1/events',
      {},
      async (type, obj: any) => {
        totalEventsReceived++;

        // Extract event data
        const reason = obj.reason || '';
        const message = obj.message || 'No message provided';
        const podName = obj.involvedObject?.name || 'unknown-pod';
        const namespace = obj.metadata?.namespace || 'unknown-namespace';
        const timestamp = obj.lastTimestamp || new Date().toISOString();
        const eventType = obj.type || 'Normal';

        // Log all events in dev mode
        if (process.env.NODE_ENV === 'development') {
          console.log(
            chalk.gray(
              `[K8sWatcher] Event #${totalEventsReceived}: ${eventType}/${reason} - ${podName}`,
            ),
          );
        }

        // Check if this is an error event we care about
        const isError =
          eventType === 'Warning' &&
          /Crash|Backoff|OOM|Evict|Preempt/i.test(reason);

        if (isError) {
          errorEventsDetected++;
          console.log(
            chalk.yellow(
              `[K8sWatcher] 🚨 Detected error event #${errorEventsDetected}:`,
            ),
          );
          console.log(
            chalk.yellow(`[K8sWatcher] Type: ${eventType}, Reason: ${reason}`),
          );
          console.log(
            chalk.yellow(
              `[K8sWatcher] Pod: ${podName}, Namespace: ${namespace}`,
            ),
          );
          console.log(chalk.yellow(`[K8sWatcher] Message: ${message}`));

          // ------------------------------------------------------------------------------
          // * DEDUPLICATION Check
          // ------------------------------------------------------------------------------
          // If the event already occurred within 1 minute window, skip current event
          const isDuplicate = await isDuplicateEvent(
            namespace,
            podName,
            reason,
          );
          if (isDuplicate) {
            console.log(
              chalk.bgGreen(
                `[Redis] 🔁 Duplicate event skipped: ${namespace}/${podName}/${reason}`,
              ),
            );
            return;
          }

          // Create event object with the structure expected by the K8s Event Processor
          const event = {
            reason,
            message,
            pod: podName,
            namespace,
            timestamp,
          };

          // Publish event to PubSub
          try {
            console.log(
              chalk.blue(
                `[K8sWatcher] Publishing event to PubSub topic: ${topicName}...`,
              ),
            );
            const messageId = await publishToTopic(topicName, event, {
              reason,
            });
            publishedEvents++;
            console.log(
              chalk.green(
                `[K8sWatcher] ✅ Event published successfully! Message ID: ${messageId}`,
              ),
            );
            console.log(
              chalk.green(
                `[K8sWatcher] Total published: ${publishedEvents}/${errorEventsDetected}`,
              ),
            );
          } catch (publishError) {
            console.error(
              chalk.red(`[K8sWatcher] ❌ Failed to publish event:`),
              publishError,
            );
          }
        }
      },
      (err) => {
        console.error(
          chalk.bgRed(`[K8sWatcher] Watch error handler triggered:`),
          err,
        );
        throw err;
      }, // Error handling when watching events fails
    );

    console.log(
      chalk.bgGreen(`[K8sWatcher] Successfully watching for Kubernetes events`),
    );

    // Setup periodic health check logging to monitor the K8s watcher
    const healthCheckIntervalMs = 60000; // 1 minute
    let healthCheckCount = 0;

    const healthCheckInterval = setInterval(() => {
      healthCheckCount++;
      console.log(
        chalk.blue(
          `[K8sWatcher] Health check #${healthCheckCount}: Active and watching for events`,
        ),
      );
      console.log(
        chalk.blue(
          `[K8sWatcher] Stats: Total=${totalEventsReceived}, Errors=${errorEventsDetected}, Published=${publishedEvents}`,
        ),
      );
    }, healthCheckIntervalMs);

    // Return a promise that never resolves to keep the process alive
    return new Promise(() => {
      console.log(
        chalk.green(`[K8sWatcher] Process will stay alive to watch for events`),
      );

      // Best practice to stop K8s process: Setup handler for graceful shutdown
      process.on('SIGINT', () => {
        console.log(
          chalk.yellow(`[K8sWatcher] Received SIGINT, shutting down...`),
        );
        clearInterval(healthCheckInterval);
        console.log(chalk.yellow(`[K8sWatcher] Goodbye!`));
        process.exit(0);
      });
    });
  } catch (error: any) {
    console.error(
      chalk.bgRed(`[K8sWatcher] Error initializing watcher: `),
      error,
    );
    if (error.stack) {
      console.error(chalk.red(`[K8sWatcher] Stack trace: ${error.stack}`));
    }

    // Retry after a delay
    console.log(chalk.yellow(`[K8sWatcher] Retrying in 5 seconds...`));
    setTimeout(() => startK8sEventWatcher(), 5000);
  }
};

// ------------------------------------------------------------------------------
// >> Module Export
// ------------------------------------------------------------------------------
export default startK8sEventWatcher;
