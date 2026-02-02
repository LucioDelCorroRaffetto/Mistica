import { ShoppingCart } from "../entities/ShoppingCart";
import { CartRepository } from "../repositories/cart-repository";

export async function getCart(
  userId: string,
  repository: CartRepository
): Promise<ShoppingCart | undefined> {
  const cart = await repository.findCartByUserId(userId);
  return cart;
}