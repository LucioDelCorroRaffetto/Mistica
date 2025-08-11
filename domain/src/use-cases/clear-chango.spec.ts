import { describe, test, expect, beforeEach, vi } from "vitest";
import { ChangoRepository } from "../repositories/chango-repository";
import { clearChango } from "./clear-chango";

describe("ClearChango Use Case", () => {
  let mockRepository: ChangoRepository;
  const userId = "reader123";

  beforeEach(() => {
    mockRepository = {
      findChangoByUserId: vi.fn(),
      saveChango: vi.fn(),
      clearChango: vi.fn(),
      removeChangoItem: vi.fn(),
    };
  });

  test("should call the repository's clearChango method with the correct userId", async () => {
    vi.mocked(mockRepository.clearChango).mockResolvedValue(true);

    const result = await clearChango(userId, mockRepository);

    expect(mockRepository.clearChango).toHaveBeenCalledWith(userId);
    expect(result).toBe(true);
  });
});