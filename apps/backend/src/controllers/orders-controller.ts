import { Router, Request, Response } from "express";
import { createOrder, getOrdersByUser, getTotalSpent } from "../services/orders-service";

export const ordersRouter = Router();

ordersRouter.get("/orders", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ ok: false, message: "userId required" });
      return;
    }
    const orders = await getOrdersByUser(userId);
    res.status(200).json({ ok: true, payload: orders });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error?.message || "Internal server error" });
  }
});

ordersRouter.get("/orders/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ ok: false, message: "userId required" });
      return;
    }
    const orders = await getOrdersByUser(userId);
    const order = orders.find((o: any) => o.id === orderId);
    if (!order) {
      res.status(404).json({ ok: false, message: "Order not found" });
      return;
    }
    res.status(200).json({ ok: true, payload: order });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error?.message || "Internal server error" });
  }
});

ordersRouter.post("/orders", async (req: Request, res: Response) => {
  try {
    const order = req.body;
    if (!order || !order.userId || !order.items) {
      res.status(400).json({ ok: false, message: "Missing required fields" });
      return;
    }
    const created = await createOrder(order);
    res.status(201).json({ ok: true, payload: created });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error?.message || "Internal server error" });
  }
});

ordersRouter.get("/orders/stats/total", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ ok: false, message: "userId required" });
      return;
    }
    const total = await getTotalSpent(userId);
    res.status(200).json({ ok: true, payload: { total } });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error?.message || "Internal server error" });
  }
});
