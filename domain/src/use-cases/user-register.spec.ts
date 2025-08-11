import { describe, test, expect, beforeEach, vi } from "vitest";
import { UserRegister } from "./user-register";
import { User } from "../entities/User";
import {
  mockUserRepository,
  MockedUserRepository,
  MockPasswordHasher,
} from "../mocks/user-mock";
import { IPasswordHasher } from "../validations/hasher";

describe("UserRegister Use Case", async () => {
  let validUser: User;
  let mockRepository: MockedUserRepository;
  let mockPasswordHasher: IPasswordHasher;

  beforeEach(() => {
    validUser = {
      id: "1",
      name: "testuser",
      email: "test@example.com",
      passwordHash: "securepassword",
      role: "cliente",
    };

    mockRepository = mockUserRepository();
    mockPasswordHasher = new MockPasswordHasher();
  });

  test("should register a valid user and hash the password", async () => {
    const hashSpy = vi
      .spyOn(mockPasswordHasher, "hash")
      .mockResolvedValue("hashed_securepassword");
    const user = await UserRegister(
      validUser,
      mockRepository,
      mockPasswordHasher
    );

    expect(user).not.toEqual(validUser);
    expect(user.passwordHash).toBe("hashed_securepassword");
    expect(mockRepository.users).toHaveLength(1);
    expect(mockRepository.users[0].passwordHash).toBe("hashed_securepassword");
    expect(hashSpy).toHaveBeenCalledWith("securepassword");
  });

  test("should throw an error if email is missing", async () => {
    validUser.email = "";
    await expect(() =>
      UserRegister(validUser, mockRepository, mockPasswordHasher)
    ).rejects.toThrow("Email is required");
  });

  test("should throw an error if password is missing", async () => {
    validUser.passwordHash = "";
    await expect(() =>
      UserRegister(validUser, mockRepository, mockPasswordHasher)
    ).rejects.toThrow("Password is required");
  });

  test("should throw an error if name is missing", async () => {
    validUser.name = "";
    await expect(() =>
      UserRegister(validUser, mockRepository, mockPasswordHasher)
    ).rejects.toThrow("Name is required");
  });

  test("should fail if email is already in use", async () => {
    const existingUser: User = {
      id: "2",
      name: "existinguser",
      email: "test@example.com",
      passwordHash: "hashed_otherpassword",
      role: "cliente",
    };

    const prePopulatedRepository = mockUserRepository([existingUser]);

    await expect(() =>
      UserRegister(validUser, prePopulatedRepository, mockPasswordHasher)
    ).rejects.toThrow("Email is already in use");

    expect(prePopulatedRepository.users).toHaveLength(1);
    expect(prePopulatedRepository.users[0]).toEqual(existingUser);
  });
});