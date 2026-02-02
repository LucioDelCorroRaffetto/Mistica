import { ShoppingCart, CartItem } from "@domain/src/entities/ShoppingCart";
import cartRepository from "../data/cart-repository";

const addToCart = async (input: {
  userId: string;
  productId: string;
  quantity: number;
}): Promise<ShoppingCart> => {
  let cart = await cartRepository.findCartByUserId(input.userId);

  if (!cart) {
    cart = {
      id: `cart-${Date.now()}`,
      userId: input.userId,
      items: [],
    };
  }

  const existingItem = cart.items.find((item: CartItem) => item.productId === input.productId);

  if (existingItem) {
    existingItem.quantity += input.quantity;
  } else {
    const newItem: CartItem = {
      productId: input.productId,
      quantity: input.quantity,
    };
    cart.items.push(newItem);
  }

  return await cartRepository.saveCart(cart);
};

const getCartByUserId = async (userId: string): Promise<ShoppingCart | null> => {
  return cartRepository.findCartByUserId(userId);
};

const removeFromCart = async (userId: string, productId: string): Promise<boolean> => {
  return cartRepository.removeCartItem(userId, productId);
};

const clearCart = async (userId: string): Promise<boolean> => {
  return cartRepository.clearCart(userId);
};

export default {
  addToCart,
  getCartByUserId,
  removeFromCart,
  clearCart,
};