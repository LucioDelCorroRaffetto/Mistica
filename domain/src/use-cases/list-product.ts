import { Product } from "../entities/Products";
import { ProductRepository } from "../repositories/product-repository";

export async function listProducts(
  repository: ProductRepository
): Promise<Product[]> {
  return repository.findAll();
}