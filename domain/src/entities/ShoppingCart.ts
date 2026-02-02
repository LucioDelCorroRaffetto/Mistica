export interface ShoppingCart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}
