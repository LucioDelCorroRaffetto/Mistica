import { Request } from "express";
import { Role } from "../entities/User";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}