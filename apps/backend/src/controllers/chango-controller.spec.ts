import { Request, Response, NextFunction } from "express";
import request from "supertest";
import { describe, beforeEach, test, vi, expect } from "vitest";
import app from "../app";
import { AuthenticatedUser } from "@domain/src/validations/auth-type";
import { Chango } from "@domain/src/entities/Chango";
import ChangoService from "../services/chango-service";

vi.mock("../services/chango-service");

vi.mock("../middlewares/auth-middleware", () => {
  const mockUser: AuthenticatedUser = {
    id: "cliente-001",
    email: "ana.perez@libreria.com",
    name: "Ana Perez",
    role: "cliente",
  };
  return {
    authenticate: vi.fn((req, res, next) => {
      req.user = mockUser;
      next();
    }),
    authorize: vi.fn(
      () => (req: Request, res: Response, next: NextFunction) => next()
    ),
  };
});

describe("Cart Controller", () => {
  const mockUser: AuthenticatedUser = {
    id: "cliente-001",
    email: "ana.perez@libreria.com",
    name: "Ana Perez",
    role: "cliente",
  };

  const mockChango: Chango = {
    id: "chango-001",
    userId: mockUser.id,
    item: [
      { productId: "libro-001", quantity: 2 },
      { productId: "libro-002", quantity: 1 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/cart", () => {
    const validaddToChangoRequest = {
      productId: "libro-001",
      productName: "El Aleph",
      productPrice: 3500,
      quantity: 2,
    };

    test("should return 200 and the updated chango for a valid request", async () => {
      vi.mocked(ChangoService.addToChango).mockResolvedValue(mockChango);

      const res = await request(app)
        .post("/api/cart")
        .send(validaddToChangoRequest);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload.item[0]).toEqual(mockChango.item[0]);
      expect(ChangoService.addToChango).toHaveBeenCalledWith({
        ...validaddToChangoRequest,
        userId: mockUser.id,
      });
    });

    test("should return 400 for an invalid request (quantity <= 0)", async () => {
      vi.mocked(ChangoService.addToChango).mockRejectedValue(
        new Error("Quantity must be greater than 0")
      );

      const res = await request(app)
        .post("/api/cart")
        .send({ ...validaddToChangoRequest, quantity: 0 });

      expect(res.statusCode).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Quantity must be greater than 0");
    });
  });

  describe("GET /api/cart", () => {
    test("should return 200 and the cart content for an authenticated user", async () => {
      vi.mocked(ChangoService.getChangoByUserId).mockResolvedValue(mockChango);

      const res = await request(app).get("/api/cart");

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(mockChango);
      expect(ChangoService.getChangoByUserId).toHaveBeenCalledWith(mockUser.id);
    });

    test("should return 200 and a null payload if the cart is empty", async () => {
      vi.mocked(ChangoService.getChangoByUserId).mockResolvedValue(null);

      const res = await request(app).get("/api/cart");

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toBeNull();
    });
  });

  describe("DELETE /api/cart", () => {
    test("should return 200 and a success message when clearing the cart", async () => {
      vi.mocked(ChangoService.clearChango).mockResolvedValue(true);

      const res = await request(app).delete("/api/cart");

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.message).toBe("Carrito vaciado correctamente");
      expect(ChangoService.clearChango).toHaveBeenCalledWith(mockUser.id);
    });

    test("should return 404 if the cart does not exist", async () => {
      vi.mocked(ChangoService.clearChango).mockResolvedValue(false);

      const res = await request(app).delete("/api/cart");

      expect(res.statusCode).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("El chango del usuario no se encontró");
    });
  });

  describe("DELETE /api/cart/:productId", () => {
    const productId = "libro-001";

    test("should return 200 and a success message when a product is removed", async () => {
      vi.mocked(ChangoService.removeFromChango).mockResolvedValue(true);

      const res = await request(app).delete(`/api/cart/${productId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.message).toBe("Producto eliminado del chango");
      expect(ChangoService.removeFromChango).toHaveBeenCalledWith(
        mockUser.id,
        productId
      );
    });

    test("should return 404 if the product is not found in the cart", async () => {
      vi.mocked(ChangoService.removeFromChango).mockResolvedValue(false);

      const res = await request(app).delete(`/api/cart/${productId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("El producto no se encontró en el chango");
    });
  });
});