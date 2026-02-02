import { describe, test, expect, beforeEach, vi } from "vitest";
import { CreateProduct } from "./create-product";
import { ProductRepository } from "../repositories/product-repository";
import { Product } from "../entities/Products";

describe("CreateProduct Use Case", () => {
  let mockRepository: ProductRepository;
  let productData: Product;

  beforeEach(() => {
    productData = {
      id: "1",
      name: "Sample",
      price: 10,
      stock: 5,
      category: "Test",
      description: "Desc",
      imageUrl: "u",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository = {
      save: vi.fn().mockResolvedValue(productData),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
  });

  test("should create product and return it", async () => {
    const result = CreateProduct(productData, mockRepository);

    expect(mockRepository.save).toHaveBeenCalledWith(productData);
    expect(result).toEqual(productData);
  });

  test("should throw if name is missing", () => {
    const bad = { ...productData, name: "" } as Product;
    expect(() => CreateProduct(bad, mockRepository)).toThrow(
      /Name is required/
    );
  });
});
import { Product } from "../entities/Products";
import { ProductRepository } from "../repositories/product-repository";

export function CreateProduct(
  productData: Product,
  repository: ProductRepository
): Product {
  validateFields(
    productData.name,
    productData.description,
    productData.price,
    productData.stock
  );

  repository.save(productData);

  return productData;
}

function validateFields(
  name: string,
  description: string,
  price: number,
  stock: number
): void {
  if (!name || name.trim() === "") {
    throw new Error("Name is required");
  }
  if (!description || description.trim() === "") {
    throw new Error("Description is required");
  }
  if (price <= 0) {
    throw new Error("Price must be greater than 0");
  }
  if (stock < 0) {
    throw new Error("Stock cannot be 0 or negative");
  }
}