import { Product } from "../entities/Products";
import { ProductRepository } from "../repositories/product-repository";

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
}

export async function updateProduct(
  id: string,
  request: UpdateProductRequest,
  repository: ProductRepository
): Promise<Product | null> {
  const existingProduct = await repository.findById(id);

  if (!existingProduct) {
    return null;
  }

  const updatedProduct: Product = {
    ...existingProduct,
    ...request,
    updatedAt: new Date(),
  };

  await repository.save(updatedProduct);

  return updatedProduct;
}