import { vi, describe, it, expect } from "vitest";
import { getProducts } from "./api";

describe("getProducts", () => {
  it("should return products on success", async () => {
    const mockResponse = [{ id: "libro-001", name: "El Aleph" }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await getProducts();
    expect(result).toEqual(mockResponse);
  });

  it("should throw error on network failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(getProducts()).rejects.toThrow("Network error");
  });
});