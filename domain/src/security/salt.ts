import bcrypt from "bcryptjs";
import { IPasswordHasher } from "../validations/hasher";

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 10;

  async hash(passwordHash: string): Promise<string> {
    return bcrypt.hash(passwordHash, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}