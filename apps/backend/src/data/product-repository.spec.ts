import { describe, beforeEach, test, expect } from "vitest";
import productRepository from "./product-repository";
import { productsDB } from "../database/products-db";
import { Product } from "@domain/src/entities/Products";

describe("Product Repository", () => {
  beforeEach(() => {
    productsDB.splice(0, productsDB.length);
  });

  test("should return an empty array if no products exit", async () => {
    const products = await productRepository.getAllProducts();
    expect(products).toEqual([]);
  });

  test("should save a new product and return it with an ID and timestamps", async () => {
    const newProductData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name: "El Aleph",
      description: "Libro de cuentos de Jorge Luis Borges.",
      price: 3500,
      stock: 8,
      category: "Ficción",
      imageUrl: "https://ejemplo.com/aleph.jpg",
    };
    const savedProduct = await productRepository.save(
      newProductData as Product
    );

    expect(savedProduct).toHaveProperty("id");
    expect(typeof savedProduct.id).toBe("string");
    expect(savedProduct).toHaveProperty("createdAt");
    expect(savedProduct).toHaveProperty("updatedAt");
    expect(typeof savedProduct.updatedAt).toBe("object");
    expect(savedProduct.name).toBe("El Aleph");
    expect(productsDB).toContainEqual(savedProduct);
  });

  test("should return null if product not found by ID", async () => {
    const product = await productRepository.findById("non-existent-id");
    expect(product).toBeNull();
  });

  test("should return a product by its ID", async () => {
    const product1: Product = {
      id: "1",
      name: "El Aleph",
      description: "Libro de cuentos de Jorge Luis Borges.",
      price: 3500,
      stock: 8,
      category: "Ficción",
      imageUrl: "https://ejemplo.com/aleph.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const product2: Product = {
      id: "2",
      name: "Rayuela",
      description: "Novela de Julio Cortázar.",
      price: 4200,
      stock: 5,
      category: "Novela",
      imageUrl: "https://ejemplo.com/rayuela.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    productsDB.push(product1, product2);

    const foundProduct = await productRepository.findById("1");
    expect(foundProduct).toEqual(product1);
  });

  test("should update an existing product by ID and return the updated product", async () => {
    const product: Product = {
      id: "123",
      name: "Ficciones",
      description: "Otro libro de Borges.",
      price: 3000,
      stock: 4,
      category: "Ficción",
      imageUrl: "https://ejemplo.com/ficciones.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    productsDB.push(product);

    const updates = { name: "Ficciones (Edición Actualizada)", price: 3200 };
    const updatedProduct = await productRepository.updateById("123", updates);

    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct?.name).toBe("Ficciones (Edición Actualizada)");
    expect(updatedProduct?.price).toBe(3200);
    expect(updatedProduct?.updatedAt).toBeInstanceOf(Date);
    expect(productsDB[0]).toEqual(updatedProduct);
  });

  test("should return null when trying to update a non-existent product", async () => {
    const updates = { name: "Nuevo Nombre" };
    const updatedProduct = await productRepository.updateById(
      "non-existent",
      updates
    );
    expect(updatedProduct).toBeNull();
  });

  test("should delete a product by ID and return true", async () => {
    const product: Product = {
      id: "123",
      name: "Bestiario",
      description: "Libro de cuentos de Julio Cortázar.",
      price: 2500,
      stock: 3,
      category: "Cuentos",
      imageUrl: "https://ejemplo.com/bestiario.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    productsDB.push(product);

    const result = await productRepository.deleteById("123");
    expect(result).toBe(true);
    expect(productsDB).not.toContainEqual(product);
  });

  test("should return false when trying to delete a non-existent product", async () => {
    const result = await productRepository.deleteById("non-existent");
    expect(result).toBe(false);
  });
});