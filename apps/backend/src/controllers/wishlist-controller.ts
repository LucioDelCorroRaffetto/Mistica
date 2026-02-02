import { Router, Request, Response } from "express";
import {
  getMyWishlist,
  addBookToWishlist,
  removeBookFromWishlist,
  clearMyWishlist,
  isBookInWishlist,
} from "@domain/src/use-cases/manage-wishlist";

export const wishlistRouter = Router();

wishlistRouter.get("/wishlist", (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return;
    }
    const wishlist = getMyWishlist(userId);
    res.json(wishlist);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

wishlistRouter.post("/wishlist/add", (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      res.status(400).json({ error: "userId and productId required" });
      return;
    }
    const item = addBookToWishlist(userId, productId);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

wishlistRouter.delete("/wishlist/remove", (req: Request, res: Response) => {
  try {
    // Support both JSON body and query params for DELETE requests
    let userId: string | undefined = undefined;
    let productId: string | undefined = undefined;

    if (req.body && Object.keys(req.body).length > 0) {
      userId = req.body.userId;
      productId = req.body.productId;
    }

    if ((!userId || !productId) && (req.query.userId || req.query.productId)) {
      userId = (req.query.userId as string) || userId;
      productId = (req.query.productId as string) || productId;
    }

    if (!userId || !productId) {
      res.status(400).json({ error: "userId and productId required" });
      return;
    }

    removeBookFromWishlist(userId, productId);
    res.json({ message: "Item removed from wishlist" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

wishlistRouter.delete("/wishlist/clear", (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return;
    }
    clearMyWishlist(userId);
    res.json({ message: "Wishlist cleared" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

wishlistRouter.get("/wishlist/check", (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.query;
    if (!userId || !productId) {
      res.status(400).json({ error: "userId and productId required" });
      return;
    }
    const inWishlist = isBookInWishlist(userId as string, productId as string);
    res.json({ inWishlist });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
