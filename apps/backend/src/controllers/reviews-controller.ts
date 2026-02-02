import { Router, Request, Response } from "express";
import { createReview, getProductReviews, getProductRating } from "@domain/src/use-cases/review-product";

export const reviewsRouter = Router();

reviewsRouter.post("/:productId/reviews", (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { userId, rating, title, comment } = req.body;

    if (!rating || !title || !comment) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const review = createReview(productId, userId, rating, title, comment);
    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

reviewsRouter.get("/:productId/reviews", (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const reviews = getProductReviews(productId);
    res.json(reviews);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

reviewsRouter.get("/:productId/rating", (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const rating = getProductRating(productId);
    res.json(rating);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
