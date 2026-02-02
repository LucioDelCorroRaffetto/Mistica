import { query } from '../database/postgres';
import type { Product } from '@domain/entities/Products';

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows.map(this.mapRow);
  }

  async findById(id: string): Promise<Product | null> {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const result = await query(
      'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );
    return result.rows.map(this.mapRow);
  }

  async findByAuthor(author: string): Promise<Product[]> {
    const result = await query(
      'SELECT * FROM products WHERE author ILIKE $1 ORDER BY name ASC',
      [`%${author}%`]
    );
    return result.rows.map(this.mapRow);
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    const result = await query(
      'SELECT * FROM products WHERE price >= $1 AND price <= $2 ORDER BY price ASC',
      [minPrice, maxPrice]
    );
    return result.rows.map(this.mapRow);
  }

  async search(query_text: string): Promise<Product[]> {
    const result = await query(
      `SELECT * FROM products 
       WHERE name ILIKE $1 OR description ILIKE $1 OR author ILIKE $1
       ORDER BY rating DESC, review_count DESC`,
      [`%${query_text}%`]
    );
    return result.rows.map(this.mapRow);
  }

  async advancedSearch(filters: {
    keyword?: string;
    author?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  }): Promise<Product[]> {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.keyword) {
      sql += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR author ILIKE $${paramIndex})`;
      params.push(`%${filters.keyword}%`);
      paramIndex++;
    }

    if (filters.author) {
      sql += ` AND author ILIKE $${paramIndex}`;
      params.push(`%${filters.author}%`);
      paramIndex++;
    }

    if (filters.category) {
      sql += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.minPrice !== undefined) {
      sql += ` AND price >= $${paramIndex}`;
      params.push(filters.minPrice);
      paramIndex++;
    }

    if (filters.maxPrice !== undefined) {
      sql += ` AND price <= $${paramIndex}`;
      params.push(filters.maxPrice);
      paramIndex++;
    }

    if (filters.minRating !== undefined) {
      sql += ` AND rating >= $${paramIndex}`;
      params.push(filters.minRating);
      paramIndex++;
    }

    sql += ' ORDER BY rating DESC, review_count DESC, created_at DESC';

    const result = await query(sql, params);
    return result.rows.map(this.mapRow);
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const result = await query(
      `INSERT INTO products (name, description, author, price, category, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [product.name, product.description, product.author, product.price, product.category, product.stock, product.imageUrl]
    );
    return this.mapRow(result.rows[0]);
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (product.name) {
      updates.push(`name = $${paramIndex}`);
      params.push(product.name);
      paramIndex++;
    }
    if (product.description) {
      updates.push(`description = $${paramIndex}`);
      params.push(product.description);
      paramIndex++;
    }
    if (product.price) {
      updates.push(`price = $${paramIndex}`);
      params.push(product.price);
      paramIndex++;
    }
    if (product.stock !== undefined) {
      updates.push(`stock = $${paramIndex}`);
      params.push(product.stock);
      paramIndex++;
    }

    if (updates.length === 0) return this.findById(id);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM products WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  async updateRating(id: string, newRating: number, reviewCount: number): Promise<void> {
    await query(
      'UPDATE products SET rating = $1, review_count = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newRating, reviewCount, id]
    );
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
