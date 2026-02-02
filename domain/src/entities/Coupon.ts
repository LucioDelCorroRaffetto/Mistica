export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // percentage (0-100) or fixed amount
  maxUses: number;
  currentUses: number;
  minPurchaseAmount: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
