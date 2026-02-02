import { Coupon } from "@domain/src/entities/Coupon";

export let couponsDB: Coupon[] = [
  {
    id: "coupon-001",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    maxUses: 100,
    currentUses: 25,
    minPurchaseAmount: 1000,
    expiryDate: new Date("2025-12-31"),
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "coupon-002",
    code: "BLACKFRIDAY",
    type: "percentage",
    value: 25,
    maxUses: 50,
    currentUses: 45,
    minPurchaseAmount: 5000,
    expiryDate: new Date("2024-12-31"),
    isActive: false,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-30"),
  },
  {
    id: "coupon-003",
    code: "BOOK500",
    type: "fixed",
    value: 500,
    maxUses: 200,
    currentUses: 120,
    minPurchaseAmount: 3000,
    expiryDate: new Date("2025-06-30"),
    isActive: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
];

export function getCouponByCode(code: string): Coupon | undefined {
  return couponsDB.find(
    (c) =>
      c.code === code.toUpperCase() &&
      c.isActive &&
      c.expiryDate > new Date() &&
      c.currentUses < c.maxUses
  );
}

export function validateCoupon(code: string, purchaseAmount: number): boolean {
  const coupon = getCouponByCode(code);
  if (!coupon) return false;
  return purchaseAmount >= coupon.minPurchaseAmount;
}

export function applyCoupon(code: string): void {
  const coupon = getCouponByCode(code);
  if (coupon) {
    coupon.currentUses++;
  }
}

export function calculateDiscount(coupon: Coupon, amount: number): number {
  if (coupon.type === "percentage") {
    return (amount * coupon.value) / 100;
  }
  return Math.min(coupon.value, amount);
}

export function createCoupon(coupon: Coupon): Coupon {
  couponsDB.push(coupon);
  return coupon;
}
