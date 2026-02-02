import { describe, test, expect } from 'vitest';
import {
  sanitizeUser,
  formatChangoResponse,
  formatProductResponse,
  formatProductsResponse,
} from './data-formatter';

describe('Data Formatter Utils', () => {
  describe('sanitizeUser', () => {
    test('should remove passwordHash from user object', () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        name: 'Test',
        passwordHash: 'secret',
      };

      const sanitized = sanitizeUser(user);

      expect(sanitized).not.toHaveProperty('passwordHash');
      expect(sanitized.id).toBe('1');
      expect(sanitized.email).toBe('test@test.com');
    });

    test('should return object without password hash', () => {
      const user = { name: 'John', age: 30, passwordHash: 'hashed' };
      const sanitized = sanitizeUser(user);

      expect(Object.keys(sanitized)).not.toContain('passwordHash');
      expect(Object.keys(sanitized)).toContain('name');
      expect(Object.keys(sanitized)).toContain('age');
    });
  });

  describe('formatChangoResponse', () => {
    test('should format chango object with items array', () => {
      const chango = {
        id: 'cart-1',
        userId: 'user-1',
        item: [{ productId: 'p1', quantity: 2 }],
      };

      const formatted = formatChangoResponse(chango);

      expect(formatted.id).toBe('cart-1');
      expect(formatted.userId).toBe('user-1');
      expect(formatted.items).toEqual([{ productId: 'p1', quantity: 2 }]);
      expect(formatted.itemCount).toBe(1);
    });

    test('should handle empty item array', () => {
      const chango = { id: 'cart-1', userId: 'user-1', item: [] };
      const formatted = formatChangoResponse(chango);

      expect(formatted.items).toEqual([]);
      expect(formatted.itemCount).toBe(0);
    });

    test('should return null for null input', () => {
      const result = formatChangoResponse(null);
      expect(result).toBeNull();
    });
  });

  describe('formatProductResponse', () => {
    test('should format product with correct types', () => {
      const product = {
        id: '1',
        name: 'Widget',
        description: 'Cool widget',
        price: '99.99',
        stock: '10',
        category: 'Electronics',
        imageUrl: 'http://img.com',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-06'),
      };

      const formatted = formatProductResponse(product);

      expect(formatted.id).toBe('1');
      expect(formatted.price).toBe(99.99);
      expect(typeof formatted.price).toBe('number');
      expect(formatted.stock).toBe(10);
      expect(typeof formatted.stock).toBe('number');
    });

    test('should return null for null input', () => {
      const result = formatProductResponse(null);
      expect(result).toBeNull();
    });
  });

  describe('formatProductsResponse', () => {
    test('should format array of products', () => {
      const products = [
        {
          id: '1',
          name: 'Product 1',
          price: '10.00',
          stock: '5',
        },
        {
          id: '2',
          name: 'Product 2',
          price: '20.00',
          stock: '10',
        },
      ];

      const formatted = formatProductsResponse(products);

      expect(formatted).toHaveLength(2);
      expect(formatted[0].id).toBe('1');
      expect(formatted[1].price).toBe(20);
    });

    test('should handle empty array', () => {
      const result = formatProductsResponse([]);
      expect(result).toEqual([]);
    });
  });
});
