import http from 'http';
import app from './app';
import { NotificationService } from './services/notification-service';
import { initializeDatabase } from './database/postgres';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const notificationService = new NotificationService(server);

initializeDatabase().catch((error) => {
  console.error('Failed to initialize database:', error);
  console.warn('Continuing without DB connection (development fallback). Some features will use in-memory stores.');
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket notifications enabled`);
  console.log(`🔐 Socket.io authentication with JWT enabled`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { server, notificationService };
