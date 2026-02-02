import type { Product } from "@domain/entities/Products";

export interface CombinedCartItem extends Product {
  quantity: number;
}