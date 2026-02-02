import { Coupon } from "../entities/Coupon";

// Mock data for coupons
const couponsDB: Coupon[] = [];

function getCouponByCode(code: string): Coupon | undefined {
  return couponsDB.find(
    (c) =>
      c.code === code.toUpperCase() &&
      c.isActive &&
      c.expiryDate > new Date() &&
      c.currentUses < c.maxUses
  );
}

function validateCoupon(code: string, purchaseAmount: number): boolean {
  const coupon = getCouponByCode(code);
  if (!coupon) return false;
  return purchaseAmount >= coupon.minPurchaseAmount;
}

function applyCoupon(code: string): void {
  const coupon = getCouponByCode(code);
  if (coupon) {
    coupon.currentUses++;
  }
}

function calculateDiscount(coupon: Coupon, amount: number): number {
  if (coupon.type === "percentage") {
    return (amount * coupon.value) / 100;
  }
  return Math.min(coupon.value, amount);
}

export function validateAndApplyCoupon(code: string, purchaseAmount: number): {
  isValid: boolean;
  discount: number;
  message: string;
} {
  const coupon = getCouponByCode(code);

  if (!coupon) {
    return {
      isValid: false,
      discount: 0,
      message: "Coupon not found or expired",
    };
  }

  if (!validateCoupon(code, purchaseAmount)) {
    return {
      isValid: false,
      discount: 0,
      message: `Minimum purchase of ${coupon.minPurchaseAmount} required`,
    };
  }

  const discount = calculateDiscount(coupon, purchaseAmount);
  applyCoupon(code);

  return {
    isValid: true,
    discount,
    message: "Coupon applied successfully",
  };
}
