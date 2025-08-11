import { describe, beforeEach, test, expect } from "vitest";
import cartRepository from "./chango-repository";
import { changoDB } from "../database/chango-db";
import { Chango } from "@domain/src/entities/Chango";

describe("Chango Repository", () => {
  const mockChango: Chango = {
    id: "chango-123",
    userId: "user-123",
    item: [
      { productId: "prod-abc", quantity: 2 },
      { productId: "prod-xyz", quantity: 5 },
    ],
  };

  beforeEach(() => {
    changoDB.length = 0;
    changoDB.push(mockChango);
  });

  describe("findChangoByUserId", () => {
    test("should return the chango if a matching userId is found", async () => {
      const foundChango = await cartRepository.findChangoByUserId("user-123");
      expect(foundChango).toEqual(mockChango);
    });

    test("should return null if no chango is found for the given userId", async () => {
      const foundChango = await cartRepository.findChangoByUserId(
        "non-existent-user"
      );
      expect(foundChango).toBeNull();
    });
  });

  describe("saveChango", () => {
    test("should save a new chango to the database", async () => {
      const newChango: Chango = {
        id: "chango-456",
        userId: "user-456",
        item: [],
      };
      const savedChango = await cartRepository.saveChango(newChango);

      expect(savedChango).toEqual(newChango);
      expect(changoDB.length).toBe(2);
      expect(changoDB).toContainEqual(newChango);
    });

    test("should update an existing chango in the database", async () => {
      const updatedChango: Chango = {
        ...mockChango,
        item: [{ productId: "prod-abc", quantity: 10 }],
      };
      const savedChango = await cartRepository.saveChango(updatedChango);

      expect(savedChango).toEqual(updatedChango);
      expect(changoDB.length).toBe(1);
      expect(changoDB[0]).toEqual(updatedChango);
    });
  });

  describe("clearChango", () => {
    test("should remove the chango from the database if a matching userId is found", async () => {
      const isCleared = await cartRepository.clearChango("user-123");
      expect(isCleared).toBe(true);
      expect(changoDB.length).toBe(0);
    });

    test("should return false if no chango is found for the given userId", async () => {
      const isCleared = await cartRepository.clearChango("non-existent-user");
      expect(isCleared).toBe(false);
      expect(changoDB.length).toBe(1);
    });
  });

  describe("removeChangoItem", () => {
    const initialChango = {
      id: "chango-123",
      userId: "user-123",
      items: [
        { productId: "prod-abc", quantity: 2 },
        { productId: "prod-xyz", quantity: 5 },
      ],
    };

    beforeEach(() => {
      changoDB.length = 0;
      changoDB.push(JSON.parse(JSON.stringify(initialChango)));
    });

    test("should remove a specific item from the chango and return true", async () => {
      const isRemoved = await cartRepository.removeChangoItem(
        "user-123",
        "prod-abc"
      );

      expect(isRemoved).toBe(true);
      expect(changoDB[0].item.length).toBe(1);
      expect(changoDB[0].item[0]).toEqual({
        productId: "prod-xyz",
        quantity: 5,
      });
    });

    test("should return false if the chango is not found", async () => {
      const isRemoved = await cartRepository.removeChangoItem(
        "non-existent-user",
        "prod-abc"
      );

      expect(isRemoved).toBe(false);
      expect(changoDB.length).toBe(1);
    });

    test("should return false if the item is not found in the chango", async () => {
      const isRemoved = await cartRepository.removeChangoItem(
        "user-123",
        "non-existent-prod"
      );

      expect(isRemoved).toBe(false);
      expect(changoDB[0].item.length).toBe(2);
    });
  });
});