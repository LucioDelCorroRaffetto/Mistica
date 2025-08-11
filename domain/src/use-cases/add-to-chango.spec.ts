import { beforeEach, describe, expect, test } from "vitest";
import {
  mockChangoRepository,
  MockedChangoRepository,
} from "../mocks/chango-mock";
import { AddToChango, AddToChangoRequest } from "./add-to-chango";

describe("AddToChango Use Case", () => {
  let validRequest: AddToChangoRequest;
  let mockRepository: MockedChangoRepository;

  beforeEach(() => {
    validRequest = {
      userId: "reader-123",
      productId: "book-001",
      productName: "Cien años de soledad",
      productPrice: "3500",
      quantity: 2,
    };

    mockRepository = mockChangoRepository();
  });

  test("should create a new chango when user has no existing chango", async () => {
    const chango = await AddToChango(validRequest, mockRepository);

    expect(chango.userId).toBe(validRequest.userId);
    expect(chango.item).toHaveLength(1);
    expect(chango.item[0]).toEqual({
      productId: validRequest.productId,
      quantity: validRequest.quantity,
    });
    expect(mockRepository.changos).toHaveLength(1);
  });

  test("should throw an error if userId is missing", async () => {
    const invalidRequest = { ...validRequest, userId: "" };
    await expect(() =>
      AddToChango(invalidRequest, mockRepository)
    ).rejects.toThrow("User ID is required");
  });

  test("should throw an error if productId is missing", async () => {
    const invalidRequest = { ...validRequest, productId: "" };
    await expect(() =>
      AddToChango(invalidRequest, mockRepository)
    ).rejects.toThrow("Product ID is required");
  });

  test("should throw an error if productName is missing", async () => {
    const invalidRequest = { ...validRequest, productName: "" };
    await expect(() =>
      AddToChango(invalidRequest, mockRepository)
    ).rejects.toThrow("Product name is required");
  });

  test("should throw an error if productPrice is missing", async () => {
    const invalidRequest = { ...validRequest, productPrice: "" };
    await expect(() =>
      AddToChango(invalidRequest, mockRepository)
    ).rejects.toThrow("Product price is required");
  });

  test("should throw an error if quantity is zero or negative", async () => {
    const invalidRequest = { ...validRequest, quantity: 0 };
    await expect(() =>
      AddToChango(invalidRequest, mockRepository)
    ).rejects.toThrow("Quantity must be greater than 0");
  });

  test("should add new item to existing chango", async () => {
    const existingChango = {
      id: "chango-1",
      userId: validRequest.userId,
      item: [
        {
          productId: "book-002",
          quantity: 1,
        },
      ],
    };
    mockRepository.saveChango(existingChango);

    const newRequest = {
      ...validRequest,
      productId: "book-003",
      productName: "Rayuela",
      productPrice: "4200",
      quantity: 3,
    };
    const updatedChango = await AddToChango(newRequest, mockRepository);

    expect(updatedChango.item).toHaveLength(2);
    expect(updatedChango.item).toContainEqual({
      productId: "book-002",
      quantity: 1,
    });
    expect(updatedChango.item).toContainEqual({
      productId: "book-003",
      quantity: 3,
    });
  });

  test("should increment quantity when adding existing product", async () => {
    const existingChango = {
      id: "chango-1",
      userId: validRequest.userId,
      item: [
        {
          productId: validRequest.productId,
          quantity: 2,
        },
      ],
    };
    mockRepository.saveChango(existingChango);

    const updatedChango = await AddToChango(validRequest, mockRepository);

    expect(updatedChango.item).toHaveLength(1);

    expect(updatedChango.item[0]).toEqual({
      productId: validRequest.productId,
      quantity: 4,
    });
  });
});