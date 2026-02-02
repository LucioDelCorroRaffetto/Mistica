export type NotificationType = 'stock' | 'price_drop' | 'wishlist_reminder' | 'order_update' | 'promotion' | 'reward';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedProductId?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}
