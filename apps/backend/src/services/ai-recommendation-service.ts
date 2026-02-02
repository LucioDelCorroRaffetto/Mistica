import { query } from '../database/postgres';
import type { Product } from '@domain/entities/Products';

export class AIRecommendationService {
  /**
   * Obtiene recomendaciones basadas en el historial de visualización y compra del usuario
   */
  async getPersonalizedRecommendations(
    userId: string,
    limit: number = 5
  ): Promise<Product[]> {
    try {
      // Obtener productos que el usuario ha visto/comprado
      const userHistory = await this.getUserProductHistory(userId);

      if (userHistory.length === 0) {
        // Si no hay historial, retornar productos populares
        return this.getPopularProducts(limit);
      }

      // Obtener categorías y autores preferidos del usuario
      const preferences = this.analyzeUserPreferences(userHistory);

      // Buscar productos similares basados en preferencias
      const recommendations = await this.findSimilarProducts(
        preferences,
        userHistory,
        limit
      );

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return this.getPopularProducts(limit);
    }
  }

  /**
   * Obtiene recomendaciones basadas en un producto específico
   */
  async getProductRecommendations(
    productId: string,
    limit: number = 4
  ): Promise<Product[]> {
    try {
      const result = await query(
        'SELECT * FROM products WHERE id = $1',
        [productId]
      );

      if (result.rows.length === 0) return [];

      const product = this.mapRow(result.rows[0]);

      // Buscar productos en la misma categoría o del mismo autor
      const recommendations = await query(
        `SELECT * FROM products 
         WHERE (category = $1 OR author = $2) 
         AND id != $3 
         ORDER BY rating DESC, review_count DESC
         LIMIT $4`,
        [product.category, product.author, productId, limit]
      );

      return recommendations.rows.map((row: any) => this.mapRow(row));
    } catch (error) {
      console.error('Error getting product recommendations:', error);
      return [];
    }
  }

  /**
   * Obtiene recomendaciones de trending/populares
   */
  async getTrendingProducts(limit: number = 8): Promise<Product[]> {
    try {
      const result = await query(
        `SELECT * FROM products 
         WHERE stock > 0 
         ORDER BY rating DESC, review_count DESC, created_at DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows.map((row: any) => this.mapRow(row));
    } catch (error) {
      console.error('Error getting trending products:', error);
      return [];
    }
  }

  /**
   * Obtiene productos nuevos recomendados
   */
  async getNewArrivals(limit: number = 6): Promise<Product[]> {
    try {
      const result = await query(
        `SELECT * FROM products 
         WHERE stock > 0 
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows.map((row: any) => this.mapRow(row));
    } catch (error) {
      console.error('Error getting new arrivals:', error);
      return [];
    }
  }

  /**
   * Obtiene recomendaciones basadas en el carrito actual
   */
  async getCartBasedRecommendations(
    productIds: string[],
    limit: number = 3
  ): Promise<Product[]> {
    if (productIds.length === 0) return [];

    try {
      // Obtener categorías y autores de los productos en el carrito
      const placeholders = productIds.map((_, i) => `$${i + 1}`).join(',');
      const result = await query(
        `SELECT DISTINCT category, author FROM products WHERE id IN (${placeholders})`,
        productIds
      );

      const categories = [...new Set(result.rows.map((r: any) => r.category))];
      const authors = [...new Set(result.rows.map((r: any) => r.author))];

      // Buscar productos relacionados
      const recommendations = await query(
        `SELECT * FROM products 
         WHERE (category = ANY($1::text[]) OR author = ANY($2::text[]))
         AND id != ALL($3::uuid[])
         ORDER BY rating DESC, review_count DESC
         LIMIT $4`,
        [categories, authors, productIds, limit]
      );

      return recommendations.rows.map((row: any) => this.mapRow(row));
    } catch (error) {
      console.error('Error getting cart recommendations:', error);
      return [];
    }
  }

  // Private methods

  private async getUserProductHistory(userId: string): Promise<Product[]> {
    try {
      // Obtener productos comprados
      const result = await query(
        `SELECT DISTINCT p.* FROM products p
         JOIN order_items oi ON p.id = oi.product_id
         JOIN orders o ON oi.order_id = o.id
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC
         LIMIT 20`,
        [userId]
      );

      return result.rows.map((row: any) => this.mapRow(row));
    } catch (error) {
      return [];
    }
  }

  private analyzeUserPreferences(products: Product[]): {
    categories: string[];
    authors: string[];
    avgPrice: number;
  } {
    const categories = [...new Set(products.map((p) => p.category).filter((c): c is string => Boolean(c)))];
    const authors = [...new Set(products.map((p) => p.author).filter((a): a is string => Boolean(a)))];
    const avgPrice =
      products.reduce((sum, p) => sum + p.price, 0) / Math.max(products.length, 1);

    return { categories, authors, avgPrice };
  }

  private async findSimilarProducts(
    preferences: { categories: string[]; authors: string[]; avgPrice: number },
    excludeIds: Product[],
    limit: number
  ): Promise<Product[]> {
    const excludeIdList = excludeIds.map((p) => p.id);
    const priceRange = preferences.avgPrice * 0.5;

    try {
      // Buscar productos en categorías/autores preferidos dentro del rango de precio
      const result = await query(
        `SELECT * FROM products 
         WHERE (category = ANY($1::text[]) OR author = ANY($2::text[]))
         AND id != ALL($3::uuid[])
         AND price BETWEEN $4 AND $5
         ORDER BY 
           CASE WHEN category = ANY($1::text[]) THEN 1 ELSE 2 END,
           rating DESC,
           review_count DESC
         LIMIT $6`,
        [
          preferences.categories,
          preferences.authors,
          excludeIdList,
          preferences.avgPrice - priceRange,
          preferences.avgPrice + priceRange,
          limit,
        ]
      );

      return result.rows.map((row: any) => this.mapRow(row));
    } catch (error) {
      console.error('Error finding similar products:', error);
      return [];
    }
  }

  private async getPopularProducts(limit: number): Promise<Product[]> {
    try {
      const result = await query(
        `SELECT * FROM products 
         WHERE stock > 0
         ORDER BY rating DESC, review_count DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows.map((row: any) => this.mapRow(row));
    } catch (error) {
      return [];
    }
  }

  private mapRow(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      author: row.author,
      price: parseFloat(row.price),
      category: row.category,
      stock: row.stock,
      imageUrl: row.image_url,
      rating: parseFloat(row.rating),
      reviewCount: row.review_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
