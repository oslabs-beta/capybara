import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

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

  useEffect(() => {
    const socketInstance = io(
      import.meta.env.VITE_API_URL || 'http://localhost:3000',
    );

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('[WebSocket] Connected to server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('[WebSocket] Disconnected from server');
    });

    socketInstance.on('k8s-notification', (notification: K8sNotification) => {
      console.log('[WebSocket] Received notification:', notification);
      setNotifications((prev) => [
        { ...notification, isRead: false },
        ...prev.slice(0, 49), // Keep only latest 50 notifications
      ]);
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
