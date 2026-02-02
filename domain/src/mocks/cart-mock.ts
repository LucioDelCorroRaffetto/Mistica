import { ShoppingCart } from "../entities/ShoppingCart";
import { CartRepository } from "../repositories/cart-repository";

export interface MockedCartRepository extends CartRepository {
  carts: ShoppingCart[];
}

export function mockCartRepository(): MockedCartRepository {
  const carts: ShoppingCart[] = [];

  return {
    carts,
    async findCartByUserId(userId: string): Promise<ShoppingCart | undefined> {
      return carts.find((c) => c.userId === userId);
    },
    async saveCart(cart: ShoppingCart): Promise<void> {
      const index = carts.findIndex((c) => c.id === cart.id);
      if (index !== -1) {
        carts[index] = cart;
      } else {
        carts.push(cart);
      }
    },
    async clearCart(userId: string): Promise<boolean> {
      const index = carts.findIndex((cart) => cart.userId === userId);
      if (index !== -1) {
        carts.splice(index, 1);
        return true;
      }
      return false;
    },

    async removeCartItem(userId: string, productId: string): Promise<boolean> {
      const cart = carts.find((c) => c.userId === userId);
      if (cart) {
        const itemIndex = cart.items.findIndex(
          (item) => item.productId === productId
        );
        if (itemIndex !== -1) {
          cart.items.splice(itemIndex, 1);
          return true;
        }
      }
      return false;
    },
  };
}