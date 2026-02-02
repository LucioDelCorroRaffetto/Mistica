import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { useProducts } from "./useProducts";
import * as api from "../infrastructure/api";

const mockProducts = [
  { id: "libro-001", name: "El Aleph", description: "", price: 3500, stock: 8, category: "Ficción", imageUrl: "", createdAt: new Date(), updatedAt: new Date() }
];

describe("useProducts", () => {
  it("should fetch and return products", async () => {
    vi.spyOn(api, "getProducts").mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors", async () => {
    vi.spyOn(api, "getProducts").mockRejectedValue(new Error("API error"));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("API error");
  });
});