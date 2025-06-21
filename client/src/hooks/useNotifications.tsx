import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

export interface K8sNotification {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  metadata: {
    namespace: string;
    pod: string;
    reason: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
  aiAnalysis?: string;
  similarEventsCount?: number;
  isRead?: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<K8sNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Simple function to show Sonner toast - let Sonner handle all styling
  const showToast = (notification: K8sNotification) => {
    const { type, title, message, metadata, similarEventsCount } = notification;

    // Create simple message content
    const toastMessage = `${title}\n${metadata.namespace}/${metadata.pod}\n${message}${
      similarEventsCount && similarEventsCount > 0
        ? `\n${similarEventsCount} similar events found`
        : ''
    }`;

    // Let Sonner handle the colors and styling based on type
    switch (type) {
      case 'error':
        if (metadata.severity === 'critical') {
          toast.error(toastMessage, {
            duration: 10000,
            action: {
              label: 'View Details',
              onClick: () => {
                console.log('Opening notification details:', notification.id);
              },
            },
          });
        } else {
          toast.error(toastMessage, {
            duration: 7000,
          });
        }
        break;

      case 'warning':
        toast.warning(toastMessage, {
          duration: 5000,
        });
        break;

      default:
        toast.info(toastMessage, {
          duration: 4000,
        });
        break;
    }
  };

  useEffect(() => {
    const socketInstance = io(
      import.meta.env.VITE_API_URL || 'http://localhost:3000',
    );

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('[WebSocket] Connected to server');

      // Simple connection success toast
      toast.success('Connected to Kubernetes monitoring');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('[WebSocket] Disconnected from server');

      // Simple disconnection warning toast
      toast.warning('Disconnected from monitoring server');
    });

    socketInstance.on('k8s-notification', (notification: K8sNotification) => {
      console.log('[WebSocket] Received notification:', notification);

      const newNotification = { ...notification, isRead: false };

      setNotifications((prev) => [
        newNotification,
        ...prev.slice(0, 49), // Keep only latest 50 notifications
      ]);

      // Show Sonner toast notification
      showToast(newNotification);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId),
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    isConnected,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  };
};
