import { Router, Request, Response } from "express";
import { validateAndApplyCoupon } from "@domain/src/use-cases/apply-coupon";

export const couponsRouter = Router();

couponsRouter.post("/coupons/validate", (req: Request, res: Response) => {
  try {
    const { code, purchaseAmount } = req.body;
    if (!code || !purchaseAmount) {
      res.status(400).json({ error: "code and purchaseAmount required" });
      return;
    }
    const result = validateAndApplyCoupon(code, purchaseAmount);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
