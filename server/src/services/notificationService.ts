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

// Extended notification interface for better toast control
interface ExtendedK8sNotification extends K8sNotification {
  toastConfig?: {
    duration?: number;
    dismissible?: boolean;
    showAction?: boolean;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  };
}

export const sendNotifications = async (
  event: K8sEvent,
  aiResponse: string,
  similarEvents: any,
) => {
  try {
    // Create unified notification object with toast configuration
    const notification: ExtendedK8sNotification = {
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
      // Toast-specific configuration
      toastConfig: {
        duration: getToastDuration(event.reason),
        dismissible: true,
        showAction: shouldShowAction(event.reason),
        priority: determineSeverity(event.reason) as
          | 'low'
          | 'medium'
          | 'high'
          | 'critical',
      },
    };

    // Send to dashboard via WebSocket (includes toast data)
    broadcastNotification(notification);
    console.log(
      chalk.green(
        '[Notifications] Sent to dashboard via WebSocket with toast config',
      ),
    );

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

// Helper function to determine toast duration based on event type
const getToastDuration = (reason: string): number => {
  if (reason.includes('OOMKilled')) return 15000; // 15 seconds for critical
  if (reason.includes('CrashLoopBackOff')) return 10000; // 10 seconds for high
  if (reason.includes('Failed')) return 7000; // 7 seconds for medium
  return 5000; // 5 seconds for low priority
};

// Helper function to determine if toast should show action button
const shouldShowAction = (reason: string): boolean => {
  // Show action button for events that typically require immediate attention
  const criticalReasons = ['OOMKilled', 'CrashLoopBackOff', 'Failed'];
  return criticalReasons.some((r) => reason.includes(r));
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

${
  similarEventCount > 0
    ? `_Note: Found ${similarEventCount} similar past events that informed this analysis._`
    : '_Note: No similar past events found in the database._'
}`;
};
