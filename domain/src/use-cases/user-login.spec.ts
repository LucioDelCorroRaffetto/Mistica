import { describe, test, expect, beforeEach, vi } from "vitest";
import { UserLogin, UserLoginError } from "./user-login";
import { User } from "../entities/User";
import {
  mockUserRepository,
  MockedUserRepository,
  MockPasswordHasher,
} from "../mocks/user-mock";
import { IPasswordHasher } from "../validations/hasher";

describe("UserLogin Use Case", () => {
  let mockRepository: MockedUserRepository;
  let mockPasswordHasher: IPasswordHasher;
  let existingUser: User;

  beforeEach(() => {
    existingUser = {
      id: "cliente001",
      name: "ana_perez",
      email: "ana.perez@libreria.com",
      passwordHash: "hashed_libros123",
      role: "cliente",
    };
    mockRepository = mockUserRepository([existingUser]);
    mockPasswordHasher = new MockPasswordHasher();

    vi.spyOn(mockPasswordHasher, "compare").mockImplementation(
      async (password, hashedPassword) => {
        return `hashed_${password}` === hashedPassword;
      }
    );
  });

  test("should successfully log in a user with valid credentials", async () => {
    const user = await UserLogin(
      "ana.perez@libreria.com",
      "libros123",
      mockRepository,
      mockPasswordHasher
    );
    expect(user).toEqual(existingUser);
    expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
      "libros123",
      "hashed_libros123"
    );
  });

  test("should throw an error if email is missing", async () => {
    await expect(() =>
      UserLogin("", "libros123", mockRepository, mockPasswordHasher)
    ).rejects.toThrow(UserLoginError);
    await expect(() =>
      UserLogin("", "libros123", mockRepository, mockPasswordHasher)
    ).rejects.toThrow("Email and password are required");
  });

  test("should throw an error if password is missing", async () => {
    await expect(() =>
      UserLogin("ana.perez@libreria.com", "", mockRepository, mockPasswordHasher)
    ).rejects.toThrow(UserLoginError);
    await expect(() =>
      UserLogin("ana.perez@libreria.com", "", mockRepository, mockPasswordHasher)
    ).rejects.toThrow("Email and password are required");
  });

  test("should throw an error for non-existent email", async () => {
    vi.spyOn(mockRepository, "findByEmail").mockResolvedValue(null);

    await expect(() =>
      UserLogin(
        "noexiste@libreria.com",
        "cualquierclave",
        mockRepository,
        mockPasswordHasher
      )
    ).rejects.toThrow(UserLoginError);
    await expect(() =>
      UserLogin(
        "noexiste@libreria.com",
        "cualquierclave",
        mockRepository,
        mockPasswordHasher
      )
    ).rejects.toThrow("Invalid credentials");
  });

  test("should throw an error for incorrect password", async () => {
    vi.spyOn(mockPasswordHasher, "compare").mockResolvedValue(false);

    await expect(() =>
      UserLogin(
        "ana.perez@libreria.com",
        "claveincorrecta",
        mockRepository,
        mockPasswordHasher
      )
    ).rejects.toThrow(UserLoginError);
    await expect(() =>
      UserLogin(
        "ana.perez@libreria.com",
        "claveincorrecta",
        mockRepository,
        mockPasswordHasher
      )
    ).rejects.toThrow("Invalid credentials");
  });
});