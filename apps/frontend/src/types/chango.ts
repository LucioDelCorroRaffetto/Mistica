import type { Product } from "@domain/entities/Products";

export interface CombinedChangoItem extends Product {
  quantity: number;
}