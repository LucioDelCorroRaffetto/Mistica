import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'promotion' | 'recommendation' | 'system';
  data?: Record<string, any>;
  read?: boolean;
  createdAt?: Date;
}

export function useNotifications(userId: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Conectar a socket.io server
    const newSocket = io(process.env.VITE_API_URL || 'http://localhost:3000', {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Connected to notification service');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from notification service');
      setIsConnected(false);
    });

    // Recibir notificaciones
    newSocket.on('notification', (notification: Notification) => {
      console.log('Received notification:', notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Opcional: mostrar notificación del navegador
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/mistica-logo.svg',
        });
      }
    });

    // Recibir notificaciones de broadcast
    newSocket.on('broadcast-notification', (notification: Notification) => {
      console.log('Received broadcast notification:', notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Notificación marcada como leída
    newSocket.on('notification-marked-read', ({ notificationId }: { notificationId: string }) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const markAsRead = useCallback(
    (notificationId: string) => {
      if (!socket) return;

      socket.emit('mark-notification-read', notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [socket]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    clearNotifications,
    deleteNotification,
    requestNotificationPermission,
  };
}
