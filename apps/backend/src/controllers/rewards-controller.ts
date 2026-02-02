import { Router, Request, Response } from "express";
import {
  getMyRewards,
  earnPoints,
  spendPoints,
  claimBirthdayBonus,
} from "@domain/src/use-cases/manage-rewards";

export const rewardsRouter = Router();

rewardsRouter.get("/rewards", (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return;
    }
    const rewards = getMyRewards(userId);
    res.json(rewards);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

rewardsRouter.post("/rewards/earn", (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      res.status(400).json({ error: "userId and amount required" });
      return;
    }
    const rewards = earnPoints(userId, amount);
    res.json(rewards);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

rewardsRouter.post("/rewards/spend", (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      res.status(400).json({ error: "userId and amount required" });
      return;
    }
    const rewards = spendPoints(userId, amount);
    res.json(rewards);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

rewardsRouter.post("/rewards/birthday-bonus", (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return;
    }
    const rewards = claimBirthdayBonus(userId);
    res.json(rewards);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
