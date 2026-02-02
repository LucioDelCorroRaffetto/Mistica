import { ShoppingCart, CartItem } from "../entities/ShoppingCart";
import { CartRepository } from "../repositories/cart-repository";

export interface AddToCartRequest {
  userId: string;
  productId: string;
  productName: string;
  productPrice: string;
  quantity: number;
}

export async function addToCart(
  request: AddToCartRequest,
  repository: CartRepository
): Promise<ShoppingCart> {
  let cart = await repository.findCartByUserId(request.userId);
  validateAddToCartData(request);

  if (!cart) {
    cart = {
      id: `cart-${Date.now()}`,
      userId: request.userId,
      items: [],
    };
    await repository.saveCart(cart);
  }

  const existingItem = cart.items.find((item: CartItem) => item.productId === request.productId);

  if (existingItem) {
    existingItem.quantity += request.quantity;
  } else {
    cart.items.push({
      productId: request.productId,
      quantity: request.quantity,
    });
  }

  await repository.saveCart(cart);

  return cart;
}

function validateAddToCartData(request: AddToCartRequest): void {
  if (!request.userId.trim()) {
    throw new Error("User ID is required");
  }
  if (!request.productId.trim()) {
    throw new Error("Product ID is required");
  }
  if (!request.productName.trim()) {
    throw new Error("Product name is required");
  }
  if (!request.productPrice.trim()) {
    throw new Error("Product price is required");
  }
  if (request.quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }
}