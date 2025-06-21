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
    // Connect to WebSocket server
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');

    // Listen for K8s notifications
    socket.on('k8s-notification', (notification: K8sNotification) => {
      console.log('[Toast] Received K8s notification:', notification);

      // Create toast message
      const message = `${notification.title}\n${notification.metadata.namespace}/${notification.metadata.pod}\n${notification.message}`;

      // Show toast based on type and severity
      switch (notification.type) {
        case 'error':
          if (notification.metadata.severity === 'critical') {
            toast.error(message, {
              duration: 15000,
              action: {
                label: 'View Details',
                onClick: () =>
                  console.log('View details for:', notification.id),
              },
            });
          } else {
            toast.error(message, { duration: 10000 });
          }
          break;
        case 'warning':
          toast.warning(message, { duration: 7000 });
          break;
        case 'info':
          toast.info(message, { duration: 5000 });
          break;
      }
    });

    socket.on('connect', () => {
      console.log('[Toast] Connected to WebSocket server');
      toast.success('Connected to monitoring server');
    });

    socket.on('disconnect', () => {
      console.log('[Toast] Disconnected from WebSocket server');
      toast.warning('Disconnected from monitoring server');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ToastNotifications;
