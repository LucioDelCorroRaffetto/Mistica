import { describe, beforeEach, test, vi, expect } from "vitest";
import changoService from "./chango-service";
import changoRepository from "../data/chango-repository";
import { Chango } from "@domain/src/entities/Chango";

vi.mock("../data/chango-repository.ts");
vi.mock("uuid", () => ({ v4: () => "mock-uuid" }));

describe("Chango Service", () => {
  const userId = "user-123";
  const productId = "prod-abc";
  const newProduct = {
    productId: productId,
    productName: "Test Product",
    productPrice: 10,
    quantity: 1,
    userId: userId,
  };

  const existingChango: Chango = {
    id: "chango-123",
    userId: userId,
    item: [
      { productId: "prod-xyz", quantity: 5 },
      { productId: productId, quantity: 2 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getChangoByUserId", () => {
    test("should return the chango content for a given user ID", async () => {
      vi.mocked(changoRepository.findChangoByUserId).mockResolvedValue(
        existingChango
      );

      const result = await changoService.getChangoByUserId(userId);

      expect(result).toEqual(existingChango);
      expect(changoRepository.findChangoByUserId).toHaveBeenCalledWith(userId);
    });

    test("should return null if the chango does not exist", async () => {
      vi.mocked(changoRepository.findChangoByUserId).mockResolvedValue(null);

      const result = await changoService.getChangoByUserId(userId);

      expect(result).toBeNull();
      expect(changoRepository.findChangoByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe("addToChango", () => {
    test("should add a new chango if one does not exist", async () => {
      vi.mocked(changoRepository.findChangoByUserId).mockResolvedValue(null);
      const newChango: Chango = {
        id: "mock-uuid",
        userId: userId,
        item: [{ productId: productId, quantity: 1 }],
      };
      vi.mocked(changoRepository.saveChango).mockResolvedValue(newChango);

      const result = await changoService.addToChango(newProduct);

      expect(result).toEqual(newChango);
      expect(changoRepository.findChangoByUserId).toHaveBeenCalledWith(userId);
      expect(changoRepository.saveChango).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "mock-uuid",
          userId: userId,
          item: [{ productId: productId, quantity: 1 }], // <-- corregido: "item" en vez de "items"
        })
      );
    });

    test("should add a new product to an existing chango", async () => {
      vi.mocked(changoRepository.findChangoByUserId).mockResolvedValue({
        ...existingChango,
        item: [{ productId: "other-prod", quantity: 1 }],
      });
      const updatedChango: Chango = {
        ...existingChango,
        item: [
          { productId: "other-prod", quantity: 1 },
          { productId: productId, quantity: 1 },
        ],
      };
      vi.mocked(changoRepository.saveChango).mockResolvedValue(updatedChango);

      const result = await changoService.addToChango(newProduct);

      expect(result).toEqual(updatedChango);
      expect(changoRepository.findChangoByUserId).toHaveBeenCalledWith(userId);
      expect(changoRepository.saveChango).toHaveBeenCalledWith(updatedChango);
    });

    test("should increase quantity if the product already exists in the chango", async () => {
      vi.mocked(changoRepository.findChangoByUserId).mockResolvedValue(
        existingChango
      );
      const updatedChango: Chango = {
        ...existingChango,
        item: [
          { productId: "prod-xyz", quantity: 5 },
          { productId: productId, quantity: 3 }, // 2 + 1 = 3
        ],
      };
      vi.mocked(changoRepository.saveChango).mockResolvedValue(updatedChango);

      const result = await changoService.addToChango(newProduct);

      expect(result).toEqual(updatedChango);
      expect(changoRepository.findChangoByUserId).toHaveBeenCalledWith(userId);
      expect(changoRepository.saveChango).toHaveBeenCalledWith(updatedChango);
    });
  });

  describe("clearChango", () => {
    test("should call the repository to clear the chango", async () => {
      vi.mocked(changoRepository.clearChango).mockResolvedValue(true);

      const result = await changoService.clearChango(userId);

      expect(result).toBe(true);
      expect(changoRepository.clearChango).toHaveBeenCalledWith(userId);
    });
  });

  describe("removeFromChango", () => {
    test("should call the repository to remove a chango item", async () => {
      vi.mocked(changoRepository.removeChangoItem).mockResolvedValue(true);

      const result = await changoService.removeFromChango(userId, productId);

      expect(result).toBe(true);
      expect(changoRepository.removeChangoItem).toHaveBeenCalledWith(
        userId,
        productId
      );
    });
  });
});