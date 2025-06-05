// ------------------------------------------------------------------------------
// >> NOTIFICATIONS SERVICE
// ------------------------------------------------------------------------------
import { broadcastNotification, K8sNotification } from './websocketService';
import slack_message from '../utils/slackClient';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

interface K8sEvent {
  reason: string;
  message: string;
  pod: string;
  namespace: string;
  timestamp: string;
}

export const sendNotifications = async (
  event: K8sEvent,
  aiResponse: string,
  similarEvents: any,
) => {
  try {
    // Create unified notification object
    const notification: K8sNotification = {
      id: uuidv4(),
      type: determineNotificationType(event.reason),
      title: `Kubernetes ${event.reason} Detected`,
      message: event.message,
      timestamp: event.timestamp,
      metadata: {
        namespace: event.namespace,
        pod: event.pod,
        reason: event.reason,
        severity: determineSeverity(event.reason),
      },
      aiAnalysis: aiResponse,
      similarEventsCount: similarEvents.matches?.length || 0,
    };

    // Send to dashboard via WebSocket
    broadcastNotification(notification);
    console.log(chalk.green('[Notifications] Sent to dashboard via WebSocket'));

    // Send to Slack (existing functionality)
    const slackMessage = formatSlackMessage(event, aiResponse, similarEvents);
    await slack_message(slackMessage);
    console.log(chalk.green('[Notifications] Sent to Slack'));

    return notification;
  } catch (error) {
    console.error(
      chalk.red('[Notifications] Error sending notifications:'),
      error,
    );
    throw error;
  }
};

const determineNotificationType = (
  reason: string,
): 'error' | 'warning' | 'info' => {
  const errorReasons = ['OOMKilled', 'CrashLoopBackOff', 'Failed'];
  const warningReasons = ['Backoff', 'Evicted', 'Preempted'];

  if (errorReasons.some((r) => reason.includes(r))) return 'error';
  if (warningReasons.some((r) => reason.includes(r))) return 'warning';
  return 'info';
};

const determineSeverity = (
  reason: string,
): 'low' | 'medium' | 'high' | 'critical' => {
  if (reason.includes('OOMKilled')) return 'critical';
  if (reason.includes('CrashLoopBackOff')) return 'high';
  if (reason.includes('Failed')) return 'medium';
  return 'low';
};

const formatSlackMessage = (
  event: K8sEvent,
  aiResponse: string,
  similarEvents: any,
): string => {
  const similarEventCount = similarEvents.matches?.length || 0;

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
