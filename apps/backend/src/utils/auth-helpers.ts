import { AuthenticatedRequest } from "@domain/src/validations/auth-type";

export function extractUserId(req: AuthenticatedRequest): string | null {
  return req.user?.id || null;
}

export function isAuthenticated(req: AuthenticatedRequest): boolean {
  return !!req.user?.id;
}

export function validateCartItem(
  productId: any,
  quantity: any
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!productId || typeof productId !== 'string' || productId.trim() === '') {
    errors.push('Product ID es obligatorio y debe ser un string válido');
  }

  if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
    errors.push('Quantity es obligatorio y debe ser un número mayor a 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
