import { Notification } from "@domain/src/entities/Notification";

export let notificationsDB: Notification[] = [
  {
    id: "notif-001",
    userId: "user-001",
    type: "stock",
    title: "Producto disponible nuevamente",
    message: "El Aleph está disponible en stock",
    relatedProductId: "libro-001",
    isRead: false,
    createdAt: new Date("2024-11-15"),
  },
  {
    id: "notif-002",
    userId: "user-002",
    type: "price_drop",
    title: "¡Precio reducido!",
    message: "Rayuela ahora cuesta menos",
    relatedProductId: "libro-002",
    isRead: true,
    createdAt: new Date("2024-11-10"),
    readAt: new Date("2024-11-11"),
  },
];

export function createNotification(notification: Notification): Notification {
  notificationsDB.push(notification);
  return notification;
}

export function getNotificationsByUser(userId: string): Notification[] {
  return notificationsDB.filter((n) => n.userId === userId);
}

export function getUnreadNotifications(userId: string): Notification[] {
  return getNotificationsByUser(userId).filter((n) => !n.isRead);
}

export function markAsRead(notificationId: string): Notification | undefined {
  const notification = notificationsDB.find((n) => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
    notification.readAt = new Date();
  }
  return notification;
}

export function markAllAsRead(userId: string): void {
  getUnreadNotifications(userId).forEach((n) => {
    n.isRead = true;
    n.readAt = new Date();
  });
}

export function deleteNotification(notificationId: string): void {
  const index = notificationsDB.findIndex((n) => n.id === notificationId);
  if (index > -1) {
    notificationsDB.splice(index, 1);
  }
}

export function notifyStockAvailable(
  userId: string,
  productId: string,
  productName: string
): void {
  createNotification({
    id: `notif-${Date.now()}`,
    userId,
    type: "stock",
    title: "Producto disponible",
    message: `${productName} está nuevamente en stock`,
    relatedProductId: productId,
    isRead: false,
    createdAt: new Date(),
  });
}

export function notifyPriceDrop(
  userId: string,
  productId: string,
  productName: string,
  oldPrice: number,
  newPrice: number
): void {
  createNotification({
    id: `notif-${Date.now()}`,
    userId,
    type: "price_drop",
    title: "¡Precio reducido!",
    message: `${productName}: ${oldPrice} → ${newPrice}`,
    relatedProductId: productId,
    isRead: false,
    createdAt: new Date(),
  });
}
