import { query } from '../database/postgres';
import type { User } from '@domain/entities/User';

export class UserRepositoryPostgres {
  async findById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const result = await query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length > 0 ? this.mapFullRow(result.rows[0]) : null;
  }

  async create(user: { name: string; email: string; passwordHash: string }): Promise<User> {
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [user.name, user.email, user.passwordHash]
    );
    return this.mapFullRow(result.rows[0]);
  }

  async update(id: string, updates: Partial<User>): Promise<Omit<User, 'passwordHash'> | null> {
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
      updateFields.push(`name = $${paramIndex}`);
      params.push(updates.name);
      paramIndex++;
    }
    if (updates.email) {
      updateFields.push(`email = $${paramIndex}`);
      params.push(updates.email);
      paramIndex++;
    }

    if (updateFields.length === 0) return this.findById(id);

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, role, created_at, updated_at`,
      params
    );

    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const result = await query('SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC');
    return result.rows.map(this.mapRow);
  }

  private mapRow(row: any): Omit<User, 'passwordHash'> {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role || 'cliente',
    };
  }

  private mapFullRow(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role || 'cliente',
    };
  }
}
