import { describe, test, expect, beforeEach, vi } from "vitest";
import { listProducts } from "./list-product";
import { ProductRepository } from "../repositories/product-repository";
import { Product } from "../entities/Products";

describe("ListProducts Use Case", () => {
  let mockRepository: ProductRepository;
  let mockProducts: Product[];

  beforeEach(() => {
    mockProducts = [
      {
        id: "1",
        name: "El Aleph",
        price: 3500,
        stock: 8,
        category: "Ficción",
        description: "Libro de cuentos de Jorge Luis Borges.",
        imageUrl: "URL123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Rayuela",
        price: 4200,
        stock: 5,
        category: "Novela",
        description: "Novela de Julio Cortázar.",
        imageUrl: "URL123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockRepository = {
      findAll: vi.fn().mockResolvedValue(mockProducts),
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
  });

  test("should return all products from the repository", async () => {
    const products = await listProducts(mockRepository);

    expect(products).toEqual(mockProducts); 
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });
});