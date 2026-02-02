import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export interface NotificationMessage {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'promotion' | 'recommendation' | 'system';
  data?: Record<string, any>;
  read?: boolean;
  createdAt?: Date;
}

export class NotificationService {
  private io: SocketIOServer;
  private userSockets: Map<string, string[]> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5174',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupConnectionHandlers();
  }

  private setupMiddleware() {
    // Validar token JWT antes de conectar
    this.io.use((socket: any, next: any) => {
      const token = socket.handshake?.auth?.token || (socket.handshake?.headers?.authorization || '').replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        (socket as any).userId = (decoded as any).userId || (decoded as any).id || (decoded as any).userId;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupConnectionHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const userId = (socket as any).userId;

      console.log(`User ${userId} connected with socket ${socket.id}`);

      // Guardar socket del usuario
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, []);
      }
      this.userSockets.get(userId)!.push(socket.id);

      // Unir usuario a una sala personal
      socket.join(`user:${userId}`);
      socket.join('broadcast');

      // Event listeners
      socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
        const sockets = this.userSockets.get(userId) || [];
        const index = sockets.indexOf(socket.id);
        if (index > -1) {
          sockets.splice(index, 1);
        }
        if (sockets.length === 0) {
          this.userSockets.delete(userId);
        }
      });

      // Marcar notificación como leída
      socket.on('mark-notification-read', (notificationId: string) => {
        this.io.to(`user:${userId}`).emit('notification-marked-read', {
          notificationId,
        });
      });

      // Recibir confirmación de lectura
      socket.on('notification-received', (notificationId: string) => {
        console.log(`Notification ${notificationId} received by user ${userId}`);
      });
    });
  }

  /**
   * Enviar notificación a un usuario específico
   */
  notifyUser(notification: NotificationMessage) {
    this.io.to(`user:${notification.userId}`).emit('notification', notification);
  }

  /**
   * Enviar notificación a múltiples usuarios
   */
  notifyUsers(userIds: string[], notification: Omit<NotificationMessage, 'userId'>) {
    userIds.forEach((userId) => {
      this.io.to(`user:${userId}`).emit('notification', {
        ...notification,
        userId,
      });
    });
  }

  /**
   * Enviar notificación a todos los usuarios (broadcast)
   */
  broadcastNotification(notification: Omit<NotificationMessage, 'userId'>) {
    this.io.to('broadcast').emit('broadcast-notification', notification);
  }

  /**
   * Enviar actualización de orden
   */
  notifyOrderUpdate(userId: string, orderId: string, status: string, details?: any) {
    const notification: NotificationMessage = {
      userId,
      title: 'Order Update',
      message: `Your order ${orderId} status is now ${status}`,
      type: 'order',
      data: {
        orderId,
        status,
        ...details,
      },
    };
    this.notifyUser(notification);
  }

  /**
   * Enviar confirmación de pago
   */
  notifyPaymentSuccess(userId: string, orderId: string, amount: number) {
    const notification: NotificationMessage = {
      userId,
      title: 'Payment Confirmed',
      message: `Payment of $${amount.toFixed(2)} for order ${orderId} has been confirmed`,
      type: 'payment',
      data: {
        orderId,
        amount,
        status: 'success',
      },
    };
    this.notifyUser(notification);
  }

  /**
   * Enviar promoción/recomendación
   */
  notifyPromotion(userId: string, title: string, message: string, details?: any) {
    const notification: NotificationMessage = {
      userId,
      title,
      message,
      type: 'promotion',
      data: details,
    };
    this.notifyUser(notification);
  }

  /**
   * Enviar recomendación personalizada
   */
  notifyRecommendation(userId: string, productName: string, productId: string) {
    const notification: NotificationMessage = {
      userId,
      title: 'Personalized Recommendation',
      message: `Check out ${productName} - we think you might like it!`,
      type: 'recommendation',
      data: {
        productId,
        productName,
      },
    };
    this.notifyUser(notification);
  }

  /**
   * Obtener socket del usuario
   */
  getUserSockets(userId: string): string[] {
    return this.userSockets.get(userId) || [];
  }

  /**
   * Verificar si usuario está conectado
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.length > 0;
  }

  /**
   * Obtener IO instance
   */
  getIO(): SocketIOServer {
    return this.io;
  }
}
