import { Notification } from "../entities/Notification";

// Mock data for notifications
const notificationsDB: Notification[] = [];

function createNotification(notification: Notification): Notification {
  notificationsDB.push(notification);
  return notification;
}

function getNotificationsByUser(userId: string): Notification[] {
  return notificationsDB.filter((n) => n.userId === userId);
}

function getUnreadNotifications(userId: string): Notification[] {
  return getNotificationsByUser(userId).filter((n) => !n.isRead);
}

function markAsRead(notificationId: string): Notification | undefined {
  const notification = notificationsDB.find((n) => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
    notification.readAt = new Date();
  }
  return notification;
}

function markAllAsRead(userId: string): void {
  getUnreadNotifications(userId).forEach((n) => {
    n.isRead = true;
    n.readAt = new Date();
  });
}

function deleteNotification(notificationId: string): void {
  const index = notificationsDB.findIndex((n) => n.id === notificationId);
  if (index > -1) {
    notificationsDB.splice(index, 1);
  }
}

export function getMyNotifications(userId: string): Notification[] {
  return getNotificationsByUser(userId);
}

export function getUnread(userId: string): Notification[] {
  return getUnreadNotifications(userId);
}

export function readNotification(notificationId: string): Notification | undefined {
  return markAsRead(notificationId);
}

export function readAll(userId: string): void {
  markAllAsRead(userId);
}

export function removeNotification(notificationId: string): void {
  deleteNotification(notificationId);
}

export function createAlert(
  userId: string,
  type: any,
  title: string,
  message: string,
  productId?: string
): Notification {
  return createNotification({
    id: `notif-${Date.now()}`,
    userId,
    type,
    title,
    message,
    relatedProductId: productId,
    isRead: false,
    createdAt: new Date(),
  });
}
