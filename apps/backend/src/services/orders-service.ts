import { query } from '../database/postgres';
import { v4 as uuid } from 'uuid';
import type { Order } from '@domain/src/entities/Order';

// In-memory fallback store for development when DB is unavailable
const inMemoryOrders: Order[] = [];

export async function createOrder(order: Partial<Order>): Promise<Order> {
  const id = uuid();
  const now = new Date();
  const total = order.totalPrice ?? 0;

  const paymentStatus = (order as any).paymentStatus ?? 'unpaid';

  try {
    await query(
      'INSERT INTO orders (id, user_id, status, total_amount, payment_status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$6)',
      [id, order.userId, order.status || 'pending', total, paymentStatus, now]
    );

    if (order.items && order.items.length > 0) {
      for (const it of order.items) {
        await query(
          'INSERT INTO order_items (order_id, product_id, quantity, price, created_at) VALUES ($1,$2,$3,$4,$5)',
          [id, it.productId, it.quantity, it.price, now]
        );
      }
    }
  } catch (err) {
    // If DB is down, fall back to in-memory store
    const fallbackOrder: Order = {
      id,
      userId: order.userId!,
      items: (order.items as any) || [],
      status: order.status || 'pending',
      totalPrice: total,
      discountApplied: order.discountApplied ?? 0,
      rewardsUsed: order.rewardsUsed ?? 0,
      shippingAddress: order.shippingAddress ?? '',
      trackingNumber: undefined,
      createdAt: now,
      updatedAt: now,
    };
    inMemoryOrders.push(fallbackOrder);
    return fallbackOrder;
  }

  const persisted: Order = {
    id,
    userId: order.userId!,
    items: (order.items as any) || [],
    status: order.status || 'pending',
    totalPrice: total,
    discountApplied: order.discountApplied ?? 0,
    rewardsUsed: order.rewardsUsed ?? 0,
    shippingAddress: order.shippingAddress ?? '',
    trackingNumber: undefined,
    createdAt: now,
    updatedAt: now,
  };
  return persisted;
}

export async function getOrdersByUser(userId: string) {
  try {
    const res = await query('SELECT id, status, total_amount, created_at, updated_at, tracking_number FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    const orders = [] as any[];
    for (const row of res.rows) {
      const itemsRes = await query('SELECT product_id, quantity, price FROM order_items WHERE order_id = $1', [row.id]);
      const items = itemsRes.rows.map((r: any) => ({ productId: r.product_id, quantity: r.quantity, price: Number(r.price), subtotal: Number(r.price) * r.quantity }));
      orders.push({ id: row.id, items, status: row.status, totalPrice: Number(row.total_amount), createdAt: row.created_at, trackingNumber: row.tracking_number });
    }
    return orders;
  } catch (err) {
    // Return from in-memory fallback
    return inMemoryOrders.filter((o) => o.userId === userId).map((o) => ({ id: o.id, items: o.items, status: o.status, totalPrice: o.totalPrice, createdAt: o.createdAt, trackingNumber: o.trackingNumber }));
  }
}

export async function getTotalSpent(userId: string) {
  try {
    const res = await query('SELECT COALESCE(SUM(total_amount),0) as total FROM orders WHERE user_id = $1', [userId]);
    return Number(res.rows[0].total);
  } catch (err) {
    const fromMemory = inMemoryOrders.filter((o) => o.userId === userId).reduce((s, o) => s + (o.totalPrice || 0), 0);
    return fromMemory;
  }
}
