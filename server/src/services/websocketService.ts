// ------------------------------------------------------------------------------
// >> SOCKET.IO SERVER
// ------------------------------------------------------------------------------
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import chalk from 'chalk';

let io: SocketIOServer | null = null;

export const initializeWebSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://capybara.vercel.app',
        'https://capybara-git-main.vercel.app',
        'https://capybara-frontend.vercel.app',
        /https:\/\/.*\.vercel\.app$/,
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(chalk.green(`[WebSocket] Client connected: ${socket.id}`));

    socket.on('disconnect', () => {
      console.log(
        chalk.yellow(`[WebSocket] Client disconnected: ${socket.id}`),
      );
    });
  });

  return io;
};

export const broadcastNotification = (notification: K8sNotification) => {
  if (io) {
    io.emit('k8s-notification', notification);
    console.log(
      chalk.blue('[WebSocket] Notification broadcasted to all clients'),
    );
  }
};

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
}
