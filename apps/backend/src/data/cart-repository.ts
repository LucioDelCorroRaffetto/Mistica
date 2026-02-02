import { ShoppingCart } from "@domain/src/entities/ShoppingCart";
import { cartDB } from "../database/cart-db";

const findCartByUserId = async (userId: string): Promise<ShoppingCart | null> => {
  return cartDB.find((cart) => cart.userId === userId) || null;
};

const saveCart = async (cart: ShoppingCart): Promise<ShoppingCart> => {
  const existingIndex = cartDB.findIndex((c) => c.id === cart.id);
  if (existingIndex !== -1) {
    cartDB[existingIndex] = cart;
  } else {
    cartDB.push(cart);
  }
  return cart;
};

const clearCart = async (userId: string): Promise<boolean> => {
  const index = cartDB.findIndex((cart) => cart.userId === userId);
  if (index !== -1) {
    cartDB.splice(index, 1);
    return true;
  }
  return false;
};

const removeCartItem = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  const cart = await findCartByUserId(userId);
  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
      await saveCart(cart);
      return true;
    }
  }
  return false;
};

export default {
  findCartByUserId,
  saveCart,
  clearCart,
  removeCartItem,
};