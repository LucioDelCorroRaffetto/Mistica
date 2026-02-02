import { describe, test, expect, beforeEach, vi } from "vitest";
import { updateProduct } from "./update-product";
import { ProductRepository } from "../repositories/product-repository";
import { Product } from "../entities/Products";

describe("UpdateProduct Use Case", () => {
  let mockRepository: ProductRepository;
  let mockProduct: Product;

  beforeEach(() => {
    mockProduct = {
    id: "1",
    name: "El Aleph",
    price: 3500,
    stock: 8,
    category: "Ficción",
    description: "Libro de cuentos de Jorge Luis Borges.",
    imageUrl: "URL123",
    createdAt: new Date(),
    updatedAt: new Date(),
    };

    mockRepository = {
      findById: vi.fn().mockResolvedValue(mockProduct),
      save: vi.fn().mockResolvedValue(mockProduct),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
  });

  test("should update the product and return the updated object", async () => {
    const updatedData = { name: "New Product", price: 20 };
    const result = await updateProduct("1", updatedData, mockRepository);

    expect(mockRepository.findById).toHaveBeenCalledWith("1");
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockProduct,
        ...updatedData,
        updatedAt: expect.any(Date),
      })
    );
    expect(result).not.toBeNull();
    expect(result?.name).toBe("New Product");
    expect(result?.price).toBe(20);
    expect(result?.updatedAt).toBeInstanceOf(Date);
    expect(result!.updatedAt.getTime()).toBeGreaterThan(
      mockProduct.updatedAt.getTime()
    );
  });

  test("should return null if the product is not found", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(undefined);

    const updatedData = { name: "New Product" };
    const result = await updateProduct(
      "non-existent-id",
      updatedData,
      mockRepository
    );

    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
    expect(mockRepository.save).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});