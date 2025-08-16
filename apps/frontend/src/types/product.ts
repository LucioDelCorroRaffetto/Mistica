import type { Product } from "@domain/entities/Products";

export interface ProductCardProps {
  product: Product;
}

export interface ProductContainerProps {
  products: Product[];
}