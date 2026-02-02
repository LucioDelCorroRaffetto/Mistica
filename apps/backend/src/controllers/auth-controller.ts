import { Request, Response } from "express";
import { AuthenticatedRequest } from "src/types/type";
import { User } from "@domain/src/entities/User";
import authService from "../services/auth.service";
import { validateRequiredFields, validateEmail, validatePassword } from "../utils/validation";
import {
  sendSuccess,
  sendValidationError,
  sendUnauthorized,
  sendConflict,
  sendServerError,
} from "../utils/response-builder";
import userRepository from "../data/user-repository";

/**
 * Registers a new user with email, password and username
 * Validates email format and password strength before signup
 */
const signUp = async (req: Request, res: Response): Promise<Response> => {
  const { email, password, username, role } = req.body;

  // Validate required fields
  const requiredValidation = validateRequiredFields(req.body, ['email', 'password', 'username']);
  if (!requiredValidation.isValid) {
    return sendValidationError(res, requiredValidation.errors);
  }

  // Validate email format
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return sendValidationError(res, emailValidation.errors);
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return sendValidationError(res, passwordValidation.errors);
  }

  try {
    const newUser: Omit<User, "id"> = {
      email,
      passwordHash: password,
      name: username,
      role: role || "user",
    };
    const { accessToken, refreshToken } = await authService.signUp(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, { accessToken }, 201);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return sendConflict(res, errorMessage);
  }
};

/**
 * Authenticates a user with email and password
 * Returns access token and refresh token
 */
const signIn = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const requiredValidation = validateRequiredFields(req.body, ['email', 'password']);
  if (!requiredValidation.isValid) {
    return sendValidationError(res, requiredValidation.errors);
  }

  try {
    const { accessToken, refreshToken } = await authService.signIn(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, { accessToken });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return sendUnauthorized(res, errorMessage);
  }
};

/**
 * Retrieves the current authenticated user
 * Excludes password hash from response
 */
const getMe = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as AuthenticatedRequest).user?.id;
  if (!userId) {
    return sendUnauthorized(res);
  }
  try {
    const user = await authService.getUserById(userId);
    if (!user) {
      return sendUnauthorized(res, "Usuario no encontrado");
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return sendSuccess(res, userWithoutPassword);
  } catch (error) {
    return sendServerError(res);
  }
};

/**
 * Refreshes the access token using a valid refresh token
 */
const refresh = async (req: Request, res: Response): Promise<Response> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return sendUnauthorized(res, "Refresh token no proporcionado");
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshToken(refreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return sendSuccess(res, { accessToken });
  } catch (error) {
    res.clearCookie("refreshToken");
    return sendUnauthorized(res, (error as Error).message);
  }
};

// (will export at end after all handlers are declared)

/**
 * Update current authenticated user's profile (name/email)
 */
const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user?.id;
  if (!userId) return sendUnauthorized(res);

  const { name, email } = req.body;
  if (!name && !email) {
    return sendValidationError(res, ["No fields to update"]);
  }

  try {
    const existing = await userRepository.findById(userId);
    if (!existing) return sendUnauthorized(res, "Usuario no encontrado");

    const updatedUser = {
      ...existing,
      name: name ?? existing.name,
      email: email ?? existing.email,
    };

    const saved = await userRepository.save(updatedUser as any);
    const { passwordHash, ...userWithoutPassword } = saved as any;
    return sendSuccess(res, userWithoutPassword);
  } catch (error) {
    return sendServerError(res);
  }
};

// Export controller functions (now that updateProfile is defined)
export default {
  signUp,
  signIn,
  getMe,
  refresh,
  updateProfile,
};