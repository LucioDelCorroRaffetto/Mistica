import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  validateRequiredFields,
  validateEmail,
  validatePassword,
  validateProduct,
} from './validation';

describe('Validation Utils', () => {
  describe('validateRequiredFields', () => {
    test('should return valid when all required fields are present', () => {
      const data = { email: 'test@test.com', password: 'password123' };
      const result = validateRequiredFields(data, ['email', 'password']);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should return invalid and list missing fields', () => {
      const data = { email: 'test@test.com', password: '' };
      const result = validateRequiredFields(data, ['email', 'password']);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('password es obligatorio');
    });

    test('should trim whitespace when validating', () => {
      const data = { email: '   ', password: 'password' };
      const result = validateRequiredFields(data, ['email', 'password']);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('email es obligatorio');
    });
  });

  describe('validateEmail', () => {
    test('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'name+tag@mail.com',
      ];

      validEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(true);
      });
    });

    test('should reject invalid email formats', () => {
      const invalidEmails = ['invalid', '@example.com', 'user@', 'user @example.com'];

      invalidEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('El formato del email no es válido');
      });
    });
  });

  describe('validatePassword', () => {
    test('should accept passwords with 8+ characters', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject passwords shorter than 8 characters', () => {
      const result = validatePassword('pass');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La contraseña debe tener al menos 8 caracteres');
    });
  });

  describe('validateProduct', () => {
    test('should validate a valid product', () => {
      const product = {
        name: 'Product',
        description: 'A good product',
        price: 100,
        stock: 10,
      };
      const result = validateProduct(product);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject product with missing name', () => {
      const product = {
        name: '',
        description: 'A good product',
        price: 100,
        stock: 10,
      };
      const result = validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El nombre del producto es obligatorio');
    });

    test('should reject product with invalid price', () => {
      const product = {
        name: 'Product',
        description: 'A good product',
        price: -10,
        stock: 10,
      };
      const result = validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El precio debe ser un número mayor a 0');
    });

    test('should reject product with negative stock', () => {
      const product = {
        name: 'Product',
        description: 'A good product',
        price: 100,
        stock: -5,
      };
      const result = validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El stock no puede ser negativo');
    });
  });
});
