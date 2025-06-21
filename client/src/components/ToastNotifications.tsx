// ----------------------------------------------------------
// >> SONNER TOAST NOTIFICATIONS <<
// ----------------------------------------------------------
// * This component sends real-time notifications to the dashboard *
// https://ui.shadcn.com/docs/components/sonner

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

interface K8sNotification {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  metadata: {
    namespace: string;
    pod: string;
    reason: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

const ToastNotifications = () => {
  useEffect(() => {
    console.log(
      '[Toast] 🚀 Component mounted, attempting WebSocket connection...',
    );
    console.log(
      '[Toast] 🔗 Connecting to:',
      import.meta.env.VITE_API_URL || 'http://localhost:3000',
    );

    // Connect to WebSocket server with more options
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      upgrade: true,
      forceNew: true,
    });

    // Connection events with detailed logging
    socket.on('connect', () => {
      console.log('[Toast] ✅ Connected to WebSocket server');
      console.log('[Toast] 🆔 Socket ID:', socket.id);
      console.log('[Toast] 🌐 Socket connected:', socket.connected);
      toast.success('Connected to monitoring server');
    });

    socket.on('disconnect', (reason) => {
      console.log(
        '[Toast] ❌ Disconnected from WebSocket server. Reason:',
        reason,
      );
      toast.warning('Disconnected from monitoring server');
    });

    socket.on('connect_error', (error) => {
      console.error('[Toast] 🔥 Connection error:', error);
      toast.error('Failed to connect to monitoring server');
    });

    // Listen for K8s notifications
    socket.on('k8s-notification', (notification: K8sNotification) => {
      console.log('[Toast] 📢 Received K8s notification:', notification);
      console.log('[Toast] 📋 Notification details:', {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        severity: notification.metadata.severity,
        namespace: notification.metadata.namespace,
        pod: notification.metadata.pod,
      });

      // Create toast message
      const message = `${notification.title}\n${notification.metadata.namespace}/${notification.metadata.pod}\n${notification.message}`;

      console.log(
        '[Toast] 🍞 Showing toast for:',
        notification.type,
        notification.metadata.severity,
      );

      // Show toast based on type and severity
      switch (notification.type) {
        case 'error':
          if (notification.metadata.severity === 'critical') {
            console.log('[Toast] 🔴 Showing CRITICAL error toast');
            toast.error(message, {
              duration: 15000,
              action: {
                label: 'View Details',
                onClick: () =>
                  console.log('View details for:', notification.id),
              },
            });
          } else {
            console.log('[Toast] 🟠 Showing HIGH error toast');
            toast.error(message, { duration: 10000 });
          }
          break;
        case 'warning':
          console.log('[Toast] 🟡 Showing warning toast');
          toast.warning(message, { duration: 7000 });
          break;
        case 'info':
          console.log('[Toast] 🔵 Showing info toast');
          toast.info(message, { duration: 5000 });
          break;
        default:
          console.log(
            '[Toast] ❓ Unknown notification type:',
            notification.type,
          );
          toast.info(message, { duration: 5000 });
      }
    });

    // Listen for ALL events for debugging
    socket.onAny((eventName, ...args) => {
      console.log('[Toast] 📡 Received event:', eventName, 'with data:', args);
    });

    // Test connection after a short delay
    setTimeout(() => {
      console.log('[Toast] 🧪 Connection status check:');
      console.log('[Toast] 🔌 Connected:', socket.connected);
      console.log('[Toast] 🆔 Socket ID:', socket.id);

      // Test toast to make sure Sonner is working
      toast.info('Coffybara loaded and ready!');
    }, 2000);

    // Cleanup on unmount
    return () => {
      console.log('[Toast] 🧹 Component unmounting, disconnecting socket...');
      socket.disconnect();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ToastNotifications;
