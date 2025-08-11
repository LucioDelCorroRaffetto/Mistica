import request from "supertest";
import { describe, beforeEach, test, vi, expect } from "vitest";
import app from "../app";
import { usersDB } from "../database/user-db";
import authService from "../services/auth.service";

vi.mock("../services/auth.service");

describe("Auth Controller", () => {
  const newUser = {
    email: "ana.perez@libreria.com",
    passwordHash: "LibrosSeguros2025!",
    name: "Ana Perez",
  };

  beforeEach(() => {
    usersDB.length = 0;
    vi.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    test("should register a new user and return a token", async () => {
      vi.mocked(authService.signUp).mockResolvedValue({
        accessToken: "mock-token-abc123",
        refreshToken: "mock-refresh-abc123"
      });

      const res = await request(app).post("/api/auth/register").send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload.accessToken).toBe("mock-token-abc123");
      expect(authService.signUp).toHaveBeenCalledWith(
        expect.objectContaining({ email: newUser.email })
      );
    });

    test("should return 409 if the email already exists", async () => {
      vi.mocked(authService.signUp).mockRejectedValue(
        new Error("El correo electrónico ya está registrado.")
      );

      const res = await request(app).post("/api/auth/register").send(newUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "El correo electrónico ya está registrado."
      );
    });

    test("should return 400 if required fields are missing", async () => {
      const incompleteUser = { email: "ana.perez@libreria.com" };
      const res = await request(app)
        .post("/api/auth/register")
        .send(incompleteUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Faltan campos obligatorios: email, passwordHash, name"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    test("should return a token for a valid login", async () => {
      vi.mocked(authService.signIn).mockResolvedValue({
        accessToken: "mock-token-def456",
        refreshToken: "mock-refresh-def456"
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: newUser.email, passwordHash: newUser.passwordHash });

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload.accessToken).toBe("mock-token-def456");
      expect(authService.signIn).toHaveBeenCalledWith(
        newUser.email,
        newUser.passwordHash
      );
    });

    test("should return 401 for invalid credentials", async () => {
      vi.mocked(authService.signIn).mockRejectedValue(
        new Error("Correo electrónico o contraseña incorrectos.")
      );

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: newUser.email, passwordHash: "claveIncorrecta2025" });

      expect(res.statusCode).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Correo electrónico o contraseña incorrectos."
      );
    });

    test("should return 400 if required fields are missing", async () => {
      const incompleteLogin = { email: newUser.email };
      const res = await request(app)
        .post("/api/auth/login")
        .send(incompleteLogin);

      expect(res.statusCode).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Faltan campos obligatorios: email, passwordHash"
      );
    });
  });
});