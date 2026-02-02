import { Order } from "../entities/Order";

// Mock data for orders
const ordersDB: Order[] = [];

function getOrdersByUser(userId: string): Order[] {
  return ordersDB.filter((o) => o.userId === userId);
}

function getOrderById(orderId: string): Order | undefined {
  return ordersDB.find((o) => o.id === orderId);
}

function createOrder(order: Order): Order {
  ordersDB.push(order);
  return order;
}

function updateOrderStatus(orderId: string, status: any): Order {
  const order = getOrderById(orderId);
  if (!order) throw new Error("Order not found");
  order.status = status;
  order.updatedAt = new Date();
  return order;
}

function getTotalOrderValue(userId: string): number {
  const orders = getOrdersByUser(userId);
  return orders.reduce((total, order) => total + order.totalPrice, 0);
}

export function viewOrderHistory(userId: string): Order[] {
  return getOrdersByUser(userId);
}

export function viewOrderDetail(orderId: string): Order | undefined {
  return getOrderById(orderId);
}

export function createNewOrder(order: Order): Order {
  return createOrder(order);
}

export function updateStatus(orderId: string, status: any): Order {
  return updateOrderStatus(orderId, status);
}

export function getTotalSpent(userId: string): number {
  return getTotalOrderValue(userId);
}
