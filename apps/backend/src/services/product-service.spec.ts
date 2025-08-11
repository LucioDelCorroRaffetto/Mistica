import { describe, beforeEach, test, vi } from "vitest";
import productService from "./product-service";
import productRepository from "../data/product-repository";
import { Product } from "@domain/src/entities/Products";

vi.mock("../data/product-repository.ts");

describe("Product Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProduct: Product = {
    id: "libro-001",
    name: "El Aleph",
    description: "Libro de cuentos de Jorge Luis Borges.",
    price: 3500,
    stock: 8,
    category: "Ficción",
    imageUrl: "https://ejemplo.com/aleph.jpg",
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-11-20"),
  };

  const mockProducts: Product[] = [
    mockProduct,
    {
      ...mockProduct,
      id: "libro-002",
      name: "Rayuela",
      description: "Novela de Julio Cortázar.",
      price: 4200,
      stock: 5,
      category: "Novela",
      imageUrl: "https://ejemplo.com/rayuela.jpg",
      createdAt: new Date("2023-09-01"),
      updatedAt: new Date("2023-10-10"),
    },
  ];

  describe("getAllProducts", () => {
    test("should return all products from the repository", async () => {
      vi.mocked(productRepository.getAllProducts).mockResolvedValue(
        mockProducts
      );

      const products = await productService.getAllProducts();
      expect(products).toEqual(mockProducts);
      expect(productRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProductById", () => {
    test("should return a product if found by ID", async () => {
      vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);

      const product = await productService.getProductById("libro-001");
      expect(product).toEqual(mockProduct);
      expect(productRepository.findById).toHaveBeenCalledWith("libro-001");
    });

    test("should return null if product not found by ID", async () => {
      vi.mocked(productRepository.findById).mockResolvedValue(null);

      const product = await productService.getProductById("libro-noexiste");
      expect(product).toBeNull();
      expect(productRepository.findById).toHaveBeenCalledWith("libro-noexiste");
    });
  });

  describe("createProduct", () => {
    test("should create a new product and return it", async () => {
      const newProductData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
        name: "Ficciones",
        description: "Otra obra maestra de Borges.",
        price: 3700,
        stock: 12,
        category: "Ficción",
        imageUrl: "https://ejemplo.com/ficciones.jpg",
      };

      const createdProduct = {
        ...newProductData,
        id: "libro-003",
        createdAt: new Date("2023-11-05"),
        updatedAt: new Date("2023-11-05"),
      } as Product;

      vi.mocked(productRepository.save).mockResolvedValue(createdProduct);

      const result = await productService.createProduct(
        newProductData as Product
      );
      expect(result).toEqual(createdProduct);
      expect(productRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(newProductData)
      );
    });
  });

  describe("updateProduct", () => {
    test("should update an existing product and return it", async () => {
      const updates = { name: "Ficciones (Edición Actualizada)", price: 3900 };
      const updatedProduct = { ...mockProduct, ...updates } as Product;
      vi.mocked(productRepository.updateById).mockResolvedValue(updatedProduct);

      const result = await productService.updateProduct("libro-001", updates);
      expect(result).toEqual(updatedProduct);
      expect(productRepository.updateById).toHaveBeenCalledWith("libro-001", updates);
    });

    test("should return null if product to update is not found", async () => {
      vi.mocked(productRepository.updateById).mockResolvedValue(null);

      const result = await productService.updateProduct("libro-noexiste", {
        name: "test",
      });
      expect(result).toBeNull();
      expect(productRepository.updateById).toHaveBeenCalledWith(
        "libro-noexiste",
        { name: "test" }
      );
    });
  });

  describe("deleteProduct", () => {
    test("should delete a product and return true", async () => {
      vi.mocked(productRepository.deleteById).mockResolvedValue(true);

      const result = await productService.deleteProduct("libro-001");
      expect(result).toBe(true);
      expect(productRepository.deleteById).toHaveBeenCalledWith("libro-001");
    });

    test("should return false if product to delete is not found", async () => {
      vi.mocked(productRepository.deleteById).mockResolvedValue(false);

      const result = await productService.deleteProduct("libro-noexiste");
      expect(result).toBe(false);
      expect(productRepository.deleteById).toHaveBeenCalledWith("libro-noexiste");
    });
  });
});