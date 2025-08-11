import { describe, test, expect, beforeEach, vi } from "vitest";
import { removeFromChango, RemoveFromChangoRequest } from "./delete-from-chango";
import { ChangoRepository } from "../repositories/chango-repository";

describe("RemoveFromChango Use Case", () => {
  let mockRepository: ChangoRepository;
  const request: RemoveFromChangoRequest = {
    userId: "reader123",
    productId: "book-001",
  };
  beforeEach(() => {
    mockRepository = {
      findChangoByUserId: vi.fn(),
      saveChango: vi.fn(),
      clearChango: vi.fn(),
      removeChangoItem: vi.fn(),
    };
  });

  test("should return true when a product is successfully removed from the chango", async () => {
    vi.mocked(mockRepository.removeChangoItem).mockResolvedValue(true);

    const result = await removeFromChango(request, mockRepository);

    expect(mockRepository.removeChangoItem).toHaveBeenCalledWith(
      request.userId,
      request.productId
    );
    expect(result).toBe(true);
  });

  test("should return false when the product or chango is not found", async () => {
    vi.mocked(mockRepository.removeChangoItem).mockResolvedValue(false);

    const result = await removeFromChango(request, mockRepository);

    expect(mockRepository.removeChangoItem).toHaveBeenCalledWith(
      request.userId,
      request.productId
    );
    expect(result).toBe(false);
  });
});