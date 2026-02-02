import { Request, Response } from "express";
import productService from "../services/product-service";
import { handleError } from "../errors/error";
import { validateProduct } from "../utils/validation";
import {
  sendSuccess,
  sendValidationError,
  sendNotFound,
  sendServerError,
} from "../utils/response-builder";

/**
 * Retrieves all products
 */
const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    return sendSuccess(res, products);
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * Retrieves a single product by ID
 */
const getProductById = async (req: Request, res: Response) => {
  const id = req.params.productId;

  try {
    const product = await productService.getProductById(id);

    if (!product) {
      return sendNotFound(res, `Producto con ID '${id}' no encontrado`);
    }

    return sendSuccess(res, product);
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * Creates a new product
 * Validates product data before saving
 */
const createProduct = async (req: Request, res: Response) => {
  const validation = validateProduct(req.body);
  if (!validation.isValid) {
    return sendValidationError(res, validation.errors);
  }

  try {
    const newProduct = await productService.createProduct(req.body);
    return sendSuccess(res, newProduct, 201);
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * Updates an existing product
 * Validates provided fields before updating
 */
const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.productId;
  const updates = req.body;

  // Validate only provided fields (partial update)
  if (updates.price !== undefined && typeof updates.price !== 'number') {
    return sendValidationError(res, ['El precio debe ser un número']);
  }

  if (updates.stock !== undefined && typeof updates.stock !== 'number') {
    return sendValidationError(res, ['El stock debe ser un número']);
  }

  try {
    const updatedProduct = await productService.updateProduct(id, updates);

    if (!updatedProduct) {
      return sendNotFound(res, `Producto con ID '${id}' no encontrado`);
    }

    return sendSuccess(res, updatedProduct);
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * Deletes a product by ID
 */
const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.productId;

  try {
    const deletedProduct = await productService.deleteProduct(id);

    if (!deletedProduct) {
      return sendNotFound(res, `Producto con ID '${id}' no encontrado`);
    }

    return sendSuccess(res, { message: "Producto eliminado exitosamente" });
  } catch (error) {
    return handleError(res, error);
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};