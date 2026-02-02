import { Order } from "@domain/src/entities/Order";

export let ordersDB: Order[] = [
  {
    id: "order-001",
    userId: "user-001",
    items: [
      {
        productId: "libro-001",
        productName: "El Aleph",
        quantity: 1,
        price: 3500,
        subtotal: 3500,
      },
    ],
    status: "delivered",
    totalPrice: 3500,
    discountApplied: 0,
    rewardsUsed: 0,
    shippingAddress: "Calle Principal 123, CABA",
    trackingNumber: "TRACK001",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-10"),
  },
  {
    id: "order-002",
    userId: "user-002",
    items: [
      {
        productId: "libro-002",
        productName: "Rayuela",
        quantity: 1,
        price: 4200,
        subtotal: 4200,
      },
      {
        productId: "libro-004",
        productName: "Bestiario",
        quantity: 1,
        price: 2500,
        subtotal: 2500,
      },
    ],
    status: "processing",
    totalPrice: 6700,
    discountApplied: 500,
    rewardsUsed: 100,
    shippingAddress: "Avenida Central 456, Córdoba",
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-11-16"),
  },
];

export function createOrder(order: Order): Order {
  ordersDB.push(order);
  return order;
}

export function getOrdersByUser(userId: string): Order[] {
  return ordersDB.filter((o) => o.userId === userId);
}

export function getOrderById(orderId: string): Order | undefined {
  return ordersDB.find((o) => o.id === orderId);
}

export function updateOrderStatus(orderId: string, status: any): Order {
  const order = getOrderById(orderId);
  if (!order) throw new Error("Order not found");
  order.status = status;
  order.updatedAt = new Date();
  return order;
}

export function getTotalOrderValue(userId: string): number {
  const orders = getOrdersByUser(userId);
  return orders.reduce((total, order) => total + order.totalPrice, 0);
}
