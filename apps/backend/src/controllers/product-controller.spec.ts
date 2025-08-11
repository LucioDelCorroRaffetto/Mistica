import request from "supertest";
import { describe, beforeEach, test, vi, expect } from "vitest";
import app from "../app";
import { AuthenticatedUser } from "@domain/src/validations/auth-type";
import { Product } from "@domain/src/entities/Products";
import productService from "../services/product-service";

vi.mock("../services/product-service");

const authMiddleware = vi.hoisted(() => {
  const mockAdminUser: AuthenticatedUser = {
    id: "admin-001",
    email: "sofia.admin@libreria.com",
    name: "Sofía Admin",
    role: "admin",
  };
  return {
    authenticate: vi.fn((req, res, next) => {
      req.user = mockAdminUser;
      next();
    }),
    authorize: vi.fn((roles) => {
      return vi.fn((req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
          return res.status(403).json({
            ok: false,
            message: "Forbidden: Insufficient permissions",
          });
        }
        next();
      });
    }),
  };
});

vi.mock("../middlewares/auth.middleware", () => authMiddleware);

describe("Product Controller", () => {
  const mockAdminUser: AuthenticatedUser = {
    id: "admin-001",
    email: "sofia.admin@libreria.com",
    name: "Sofía Admin",
    role: "admin",
  };

  const mockUser: AuthenticatedUser = {
    id: "cliente-001",
    email: "ana.perez@libreria.com",
    name: "Ana Perez",
    role: "cliente",
  };

  const mockProduct: Product = {
    id: "libro-001",
    name: "El Aleph",
    description: "Libro de cuentos de Jorge Luis Borges.",
    price: 3500,
    stock: 8,
    category: "Ficción",
    imageUrl: "https://ejemplo.com/aleph.jpg",
    // @ts-ignore
    createdAt: new Date().toISOString(),
    // @ts-ignore
    updatedAt: new Date().toISOString(),
  };

  const mockProducts: Product[] = [
    mockProduct,
    {
      ...mockProduct,
      id: "libro-002",
      name: "Rayuela",
      description: "Novela de Julio Cortázar.",
      price: 4200,
      stock: 5,
      category: "Novela",
      imageUrl: "https://ejemplo.com/rayuela.jpg",
    // @ts-ignore
    createdAt: new Date().toISOString(),
    // @ts-ignore
    updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    authMiddleware.authenticate.mockImplementation((req, res, next) => {
      req.user = mockAdminUser;
      next();
    });
  });

  describe("GET /api/products", () => {
    test("should return 200 and all products", async () => {
      vi.mocked(productService.getAllProducts).mockResolvedValue(mockProducts);

      const res = await request(app).get("/api/products");

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(mockProducts);
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });

    test("should return 500 if an error occurs", async () => {
      vi.mocked(productService.getAllProducts).mockRejectedValue(
        new Error("Database error")
      );

      const res = await request(app).get("/api/products");

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("GET /api/products/:productId", () => {
    test("should return 200 and the product if found", async () => {
      vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

      const res = await request(app).get("/api/products/1");

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(mockProduct);
      expect(productService.getProductById).toHaveBeenCalledWith("1");
    });

    test("should return 404 if product not found", async () => {
      vi.mocked(productService.getProductById).mockResolvedValue(null);

      const res = await request(app).get("/api/products/non-existent");

      expect(res.statusCode).toEqual(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Producto con ID 'non-existent' no encontrado"
      );
      expect(productService.getProductById).toHaveBeenCalledWith(
        "non-existent"
      );
    });

    test("should return 500 if an error occurs", async () => {
      vi.mocked(productService.getProductById).mockRejectedValue(
        new Error("Database error")
      );

      const res = await request(app).get("/api/products/1");

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("POST /api/products", () => {
    const newProductData = {
      name: "Ficciones",
      description: "Otra obra maestra de Borges.",
      price: 3700,
      stock: 12,
      category: "Ficción",
      imageUrl: "https://ejemplo.com/ficciones.jpg",
    };

    test("should return 201 and the created product for an admin", async () => {
      vi.mocked(productService.createProduct).mockResolvedValue({
        id: "libro-003",
        ...newProductData,
        // @ts-ignore
        createdAt: new Date().toISOString(),
        // @ts-ignore
        updatedAt: new Date().toISOString(),
      });

      const res = await request(app).post("/api/products").send(newProductData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(
        expect.objectContaining({ name: "New Item" })
      );
      expect(productService.createProduct).toHaveBeenCalledWith(
        expect.objectContaining(newProductData)
      );
    });

    test("should return 401 if no token is provided", async () => {
      authMiddleware.authenticate.mockImplementationOnce((req, res, next) => {
        return res.status(401).json({
          ok: false,
          message: "No authentication token provided",
        });
      });

      const res = await request(app).post("/api/products").send(newProductData);

      expect(res.statusCode).toEqual(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("No authentication token provided");
      expect(productService.createProduct).not.toHaveBeenCalled();
    });

    test("should return 403 if user is not an admin", async () => {
      authMiddleware.authenticate.mockImplementationOnce((req, res, next) => {
        req.user = mockUser;
        next();
      });

      const res = await request(app).post("/api/products").send(newProductData);

      expect(res.statusCode).toEqual(403);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Forbidden: Insufficient permissions");
      expect(productService.createProduct).not.toHaveBeenCalled();
    });

    test("should return 500 if an error occurs for an admin", async () => {
      vi.mocked(productService.createProduct).mockRejectedValue(
        new Error("Validation error")
      );

      const res = await request(app).post("/api/products").send(newProductData);

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("PUT /api/products/:productId", () => {
    const updateProductData = {
      name: "Ficciones (Edición Actualizada)",
      description: "Edición revisada de Ficciones de Borges.",
      price: 3900,
      stock: 10,
      category: "Ficción",
      imageUrl: "https://ejemplo.com/ficciones-actualizada.jpg",
    };

    const updatedProduct = {
      id: "libro-003",
      ...updateProductData,
      createdAt: new Date("2023-11-05").toISOString(),
      updatedAt: new Date("2023-12-01").toISOString(),
    };

    test("should return 200 and the updated product for an admin", async () => {
      // @ts-ignore
      vi.mocked(productService.updateProduct).mockResolvedValue(updatedProduct);

      const res = await request(app)
        .put("/api/products/1")
        .send(updateProductData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(updatedProduct);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        "1",
        updateProductData
      );
    });

    test("should return 404 if product to update is not found", async () => {
      vi.mocked(productService.updateProduct).mockResolvedValue(null);

      const res = await request(app)
        .put("/api/products/non-existent")
        .send(updateProductData);

      expect(res.statusCode).toEqual(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Producto con ID 'non-existent' no encontrado"
      );
      expect(productService.updateProduct).toHaveBeenCalledWith(
        "non-existent",
        updateProductData
      );
    });

    test("should return 401 if no token is provided", async () => {
      authMiddleware.authenticate.mockImplementationOnce((req, res, next) => {
        return res.status(401).json({
          ok: false,
          message: "No authentication token provided",
        });
      });

      const res = await request(app)
        .put("/api/products/1")
        .send(updateProductData);

      expect(res.statusCode).toEqual(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("No authentication token provided");
      expect(productService.updateProduct).not.toHaveBeenCalled();
    });

    test("should return 403 if user is not an admin", async () => {
      authMiddleware.authenticate.mockImplementationOnce((req, res, next) => {
        req.user = mockUser;
        next();
      });

      const res = await request(app)
        .put("/api/products/1")
        .send(updateProductData);

      expect(res.statusCode).toEqual(403);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Forbidden: Insufficient permissions");
      expect(productService.updateProduct).not.toHaveBeenCalled();
    });

    test("should return 500 if an error occurs for an admin", async () => {
      vi.mocked(productService.updateProduct).mockRejectedValue(
        new Error("Database error")
      );

      const res = await request(app)
        .put("/api/products/1")
        .send(updateProductData);

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("DELETE /api/products/:productId", () => {
    test("should return 200 and success message when product is deleted by admin", async () => {
      vi.mocked(productService.deleteProduct).mockResolvedValue(true);

      const res = await request(app).delete("/api/products/1");

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toBe(true);
      expect(productService.deleteProduct).toHaveBeenCalledWith("1");
    });

    test("should return 404 if product to delete is not found", async () => {
      vi.mocked(productService.deleteProduct).mockResolvedValue(false);

      const res = await request(app).delete("/api/products/non-existent");

      expect(res.statusCode).toEqual(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Producto con ID 'non-existent' no encontrado"
      );
      expect(productService.deleteProduct).toHaveBeenCalledWith("non-existent");
    });

    test("should return 401 if no token is provided", async () => {
      authMiddleware.authenticate.mockImplementationOnce((req, res, next) => {
        return res.status(401).json({
          ok: false,
          message: "No authentication token provided",
        });
      });
      const res = await request(app).delete("/api/products/1");

      expect(res.statusCode).toEqual(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("No authentication token provided");
      expect(productService.deleteProduct).not.toHaveBeenCalled();
    });

    test("should return 403 if user is not an admin", async () => {
      authMiddleware.authenticate.mockImplementationOnce((req, res, next) => {
        req.user = mockUser;
        next();
      });
      const res = await request(app).delete("/api/products/1");

      expect(res.statusCode).toEqual(403);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Forbidden: Insufficient permissions");
      expect(productService.deleteProduct).not.toHaveBeenCalled();
    });

    test("should return 500 if an error occurs for an admin", async () => {
      vi.mocked(productService.deleteProduct).mockRejectedValue(
        new Error("Database error")
      );

      const res = await request(app).delete("/api/products/1");

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });
});