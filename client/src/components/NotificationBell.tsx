// ----------------------------------------------------------
// >> NOTIFICATION BELL << //
// ----------------------------------------------------------
import React, { useState } from 'react';
import { Bell, X, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useNotifications, K8sNotification } from '../hooks/useNotifications';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion, AnimatePresence } from 'motion/react';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    isConnected,
  } = useNotifications();

  const getNotificationIcon = (type: K8sNotification['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Bell className="h-6 w-6" />

        {/* Connection Status Indicator */}
        <div
          className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full z-50 mt-2 max-h-96 w-96 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                K8s Notifications ({notifications.length})
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>No notifications yet</p>
                  <p className="text-sm">K8s events will appear here</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border-l-4 p-4 ${getSeverityColor(notification.metadata.severity)} ${
                      !notification.isRead ? 'bg-opacity-100' : 'bg-opacity-50'
                    } cursor-pointer border-b border-gray-100 transition-all hover:bg-opacity-75 dark:border-gray-700`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-1 items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            {notification.metadata.namespace}/
                            {notification.metadata.pod}
                          </p>
                          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-500">
                            {notification.message}
                          </p>
                          {notification.similarEventsCount &&
                            notification.similarEventsCount > 0 && (
                              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                                Similar events:{' '}
                                {notification.similarEventsCount}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                          className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
