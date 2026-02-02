import { useState } from 'react';
import { useNotifications } from '../hook/useNotifications';
import { useAuth } from '../hook/useAuth';
import './NotificationCenter.css';

export default function NotificationCenter() {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    clearNotifications,
    deleteNotification,
    requestNotificationPermission,
  } = useNotifications(user?.id || null);

  if (!isAuthenticated) {
    return null;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'payment':
        return '💳';
      case 'promotion':
        return '🎉';
      case 'recommendation':
        return '⭐';
      case 'system':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'order';
      case 'payment':
        return 'payment';
      case 'promotion':
        return 'promotion';
      case 'recommendation':
        return 'recommendation';
      case 'system':
        return 'system';
      default:
        return 'default';
    }
  };

  return (
    <div className="notification-center">
      {/* Bell Button */}
      <button
        className={`notification-bell ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        {isConnected && <span className="connection-indicator"></span>}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="notification-actions">
            {notifications.length > 0 && (
              <>
                <button
                  className="btn-clear-all"
                  onClick={clearNotifications}
                  title="Clear all notifications"
                >
                  Limpiar todo
                </button>
                <button
                  className="btn-request-permission"
                  onClick={requestNotificationPermission}
                  title="Enable browser notifications"
                >
                  🔔 Notificaciones del navegador
                </button>
              </>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <p>📭 Sin notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'} ${getNotificationColor(
                    notification.type
                  )}`}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    {notification.data && (
                      <div className="notification-data">
                        {notification.data.productName && (
                          <span className="data-item">
                            📚 {notification.data.productName}
                          </span>
                        )}
                        {notification.data.orderId && (
                          <span className="data-item">
                            ID: {notification.data.orderId.substring(0, 8)}...
                          </span>
                        )}
                        {notification.data.amount && (
                          <span className="data-item">
                            💰 ${notification.data.amount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                    {notification.createdAt && (
                      <span className="timestamp">
                        {formatTime(new Date(notification.createdAt))}
                      </span>
                    )}
                  </div>

                  <div className="notification-actions-item">
                    {!notification.read && (
                      <button
                        className="btn-mark-read"
                        onClick={() => markAsRead(notification.id || '')}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() =>
                        deleteNotification(notification.id || '')
                      }
                      title="Delete notification"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              Mostrando {notifications.length} notificación
              {notifications.length !== 1 ? 'es' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Justo ahora';
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;

  return date.toLocaleDateString();
}
