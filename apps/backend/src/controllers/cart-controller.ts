import { Request, Response } from "express";
import { AuthenticatedRequest } from "@domain/src/validations/auth-type";
import cartService from "../services/cart-service";
import { extractUserId, validateCartItem } from "../utils/auth-helpers";
import {
  sendSuccess,
  sendValidationError,
  sendNotFound,
  sendServerError,
} from "../utils/response-builder";

/**
 * Adds a product to the user's shopping cart
 * Validates product ID and quantity before adding
 */
const addToCart = async (req: Request, res: Response): Promise<Response> => {
  const userId = extractUserId(req as AuthenticatedRequest);
  if (!userId) {
    return sendNotFound(res, "Usuario no identificado");
  }

  const { productId, quantity } = req.body;
  const validation = validateCartItem(productId, quantity);
  if (!validation.isValid) {
    return sendValidationError(res, validation.errors);
  }

  try {
    const updatedCart = await cartService.addToCart({
      userId,
      productId,
      quantity,
    });
    return sendSuccess(res, updatedCart);
  } catch (error) {
    return sendServerError(res, (error as Error).message);
  }
};

/**
 * Retrieves the current user's shopping cart
 */
const getCart = async (req: Request, res: Response): Promise<Response> => {
  const userId = extractUserId(req as AuthenticatedRequest);
  if (!userId) {
    return sendNotFound(res, "Usuario no identificado");
  }

  try {
    const cart = await cartService.getCartByUserId(userId);
    return sendSuccess(res, cart);
  } catch (error) {
    return sendServerError(res, (error as Error).message);
  }
};

/**
 * Removes a specific product from the user's cart
 */
const removeFromCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { productId } = req.params;
  const userId = extractUserId(req as AuthenticatedRequest);

  if (!userId) {
    return sendNotFound(res, "Usuario no identificado");
  }

  if (!productId || typeof productId !== 'string') {
    return sendValidationError(res, ["Product ID inválido"]);
  }

  try {
    const updated = await cartService.removeFromCart(userId, productId);

    if (!updated) {
      return sendNotFound(res, "Producto no encontrado en el carrito");
    }

    return sendSuccess(res, updated);
  } catch (error) {
    return sendServerError(res, (error as Error).message);
  }
};

/**
 * Empties the entire shopping cart for the current user
 */
const clearCart = async (req: Request, res: Response): Promise<Response> => {
  const userId = extractUserId(req as AuthenticatedRequest);

  if (!userId) {
    return sendNotFound(res, "Usuario no identificado");
  }

  try {
    const success = await cartService.clearCart(userId);

    if (!success) {
      return sendNotFound(res, "Carrito no encontrado");
    }

    return sendSuccess(res, { message: "Carrito vaciado correctamente" });
  } catch (error) {
    return sendServerError(res, (error as Error).message);
  }
};

export default { addToCart, getCart, removeFromCart, clearCart };