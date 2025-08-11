import { describe, test, expect, beforeEach, vi } from "vitest";
import { getChango } from "./get-chango";
import { ChangoRepository } from "../repositories/chango-repository";
import { Chango } from "../entities/Chango";

describe("GetChango Use Case", () => {
  let mockRepository: ChangoRepository;
  const userId = "reader123";
  const mockChango: Chango = {
    id: "chango-1",
    userId: "reader123",
    item: [{ productId: "book-001", quantity: 2 }],
  };

  beforeEach(() => {
    mockRepository = {
      findChangoByUserId: vi.fn(),
      saveChango: vi.fn(),
      clearChango: vi.fn(),
      removeChangoItem: vi.fn(),
    };
  });

  test("should return the chango when it exists for the user", async () => {
    vi.mocked(mockRepository.findChangoByUserId).mockResolvedValue(mockChango);

    const result = await getChango(userId, mockRepository);

    expect(mockRepository.findChangoByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockChango);
  });

  test("should return null when the chango does not exist for the user", async () => {
    vi.mocked(mockRepository.findChangoByUserId).mockResolvedValue(undefined);

    const result = await getChango(userId, mockRepository);

    expect(mockRepository.findChangoByUserId).toHaveBeenCalledWith(userId);
    expect(result).toBeUndefined();
  });
});