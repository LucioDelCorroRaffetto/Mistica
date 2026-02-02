import { ShoppingCart } from "../entities/ShoppingCart";

export interface CartRepository {
  findCartByUserId(userId: string): Promise<ShoppingCart | undefined>;
  saveCart(cart: ShoppingCart): Promise<void>;
  clearCart(userId: string): Promise<boolean>;
  removeCartItem(userId: string, productId: string): Promise<boolean>;
}