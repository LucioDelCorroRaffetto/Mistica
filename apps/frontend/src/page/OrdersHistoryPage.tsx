import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import "./OrdersHistoryPage.css";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  status: string;
  totalPrice: number;
  createdAt: string;
  trackingNumber?: string;
}

export function OrdersHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? "user-001"; // fallback for dev

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders?userId=${userId}`);
      const data = await response.json();
      const ordersPayload = data?.payload ?? [];
      setOrders(ordersPayload);

      const totalResponse = await fetch(`http://localhost:3000/api/orders/stats/total?userId=${userId}`);
      const totalData = await totalResponse.json();
      const total = totalData?.payload?.total ?? 0;
      setTotalSpent(total);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "status-delivered";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div className="loading">Cargando historial...</div>;
  }

  return (
    <article className="orders-page">
      <div className="container mx-auto">
        <div className="orders-header">
          <h1>Historial de Compras</h1>
          <div className="orders-stats">
            <div className="stat">
              <span className="stat-label">Total de órdenes</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Dinero invertido</span>
              <span className="stat-value">${totalSpent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Orden #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <div className={`order-status ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.productName}</span>
                      <span className="item-qty">x{item.quantity}</span>
                      <span className="item-price">${item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">${order.totalPrice}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="tracking">
                      <span>Rastreo: {order.trackingNumber}</span>
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button className="btn btn-secondary btn-sm">
                    Ver Detalles
                  </button>
                  {order.status === "delivered" && (
                    <button className="btn btn-primary btn-sm">
                      Reordenar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-orders">
            <p>No tienes órdenes aún</p>
            <button onClick={() => navigate("/libros")} className="btn btn-primary">
              Explorar Libros
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
