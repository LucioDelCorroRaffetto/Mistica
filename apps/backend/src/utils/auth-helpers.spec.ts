import { describe, test, expect, beforeEach } from 'vitest';
import { extractUserId, isAuthenticated, validateCartItem } from './auth-helpers';

describe('Auth Helpers', () => {
  describe('extractUserId', () => {
    test('should extract user ID when user is authenticated', () => {
      const mockReq = { user: { id: 'user-123' } } as any;
      const result = extractUserId(mockReq);

      expect(result).toBe('user-123');
    });

    test('should return null when user is not authenticated', () => {
      const mockReq = {} as any;
      const result = extractUserId(mockReq);

      expect(result).toBeNull();
    });

    test('should return null when user object is undefined', () => {
      const mockReq = { user: undefined } as any;
      const result = extractUserId(mockReq);

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    test('should return true when user is authenticated', () => {
      const mockReq = { user: { id: 'user-123' } } as any;
      const result = isAuthenticated(mockReq);

      expect(result).toBe(true);
    });

    test('should return false when user is not authenticated', () => {
      const mockReq = {} as any;
      const result = isAuthenticated(mockReq);

      expect(result).toBe(false);
    });
  });

  describe('validateCartItem', () => {
    test('should accept valid cart item', () => {
      const result = validateCartItem('product-123', 5);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject missing product ID', () => {
      const result = validateCartItem(null, 5);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Product ID es obligatorio y debe ser un string válido'
      );
    });

    test('should reject empty product ID', () => {
      const result = validateCartItem('   ', 5);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Product ID es obligatorio y debe ser un string válido'
      );
    });

    test('should reject invalid quantity', () => {
      const result = validateCartItem('product-123', 0);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Quantity es obligatorio y debe ser un número mayor a 0'
      );
    });

    test('should reject negative quantity', () => {
      const result = validateCartItem('product-123', -5);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Quantity es obligatorio y debe ser un número mayor a 0'
      );
    });

    test('should reject missing quantity', () => {
      const result = validateCartItem('product-123', null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Quantity es obligatorio y debe ser un número mayor a 0'
      );
    });

    test('should return both errors when data is invalid', () => {
      const result = validateCartItem(null, -5);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });
});
