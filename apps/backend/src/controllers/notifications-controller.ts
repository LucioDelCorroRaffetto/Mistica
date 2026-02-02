import { Router, Request, Response } from "express";
import {
  getMyNotifications,
  getUnread,
  readNotification,
  readAll,
  removeNotification,
  createAlert,
} from "@domain/src/use-cases/manage-notifications";

export const notificationsRouter = Router();

notificationsRouter.get("/notifications", (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return;
    }
    const notifications = getMyNotifications(userId);
    res.json(notifications);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

notificationsRouter.get("/notifications/unread", (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return;
    }
    const unread = getUnread(userId);
    res.json(unread);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

notificationsRouter.put("/notifications/:notificationId/read", (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const notification = readNotification(notificationId);
    res.json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

notificationsRouter.put("/notifications/read-all", (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return;
    }
    readAll(userId);
    res.json({ message: "All notifications marked as read" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

notificationsRouter.delete("/notifications/:notificationId", (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    removeNotification(notificationId);
    res.json({ message: "Notification deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
