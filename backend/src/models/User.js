import bcrypt from 'bcryptjs';
import { query } from '../db.js';

const User = {
  /**
   * Create a new user with hashed password
   */
  async create({ username, email, password }) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, avatar, is_active, last_seen, preferences, created_at, updated_at`,
      [username.trim(), email.trim().toLowerCase(), hashedPassword]
    );
    return result.rows[0];
  },

  /**
   * Find user by ID (without password)
   */
  async findById(id) {
    const result = await query(
      `SELECT id, username, email, avatar, is_active, last_seen, preferences, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Find user by ID including password (for auth)
   */
  async findByIdWithPassword(id) {
    const result = await query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Find user by email (without password)
   */
  async findByEmail(email) {
    const result = await query(
      `SELECT id, username, email, avatar, is_active, last_seen, preferences, created_at, updated_at
       FROM users WHERE email = $1`,
      [email.trim().toLowerCase()]
    );
    return result.rows[0] || null;
  },

  /**
   * Find user by email with password (for login)
   */
  async findByEmailWithPassword(email) {
    const result = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email.trim().toLowerCase()]
    );
    return result.rows[0] || null;
  },

  /**
   * Find user by email or username (for duplicate checking)
   */
  async findByEmailOrUsername(email, username) {
    const result = await query(
      `SELECT id, email, username FROM users WHERE email = $1 OR username = $2 LIMIT 1`,
      [email.trim().toLowerCase(), username.trim()]
    );
    return result.rows[0] || null;
  },

  /**
   * Find user by username
   */
  async findByUsername(username) {
    const result = await query(
      `SELECT id, username FROM users WHERE username = $1`,
      [username.trim()]
    );
    return result.rows[0] || null;
  },

  /**
   * Update user by ID
   */
  async updateById(id, updates) {
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    if (updates.username !== undefined) {
      setClauses.push(`username = $${paramIndex++}`);
      values.push(updates.username.trim());
    }
    if (updates.avatar !== undefined) {
      setClauses.push(`avatar = $${paramIndex++}`);
      values.push(updates.avatar);
    }
    if (updates.is_active !== undefined) {
      setClauses.push(`is_active = $${paramIndex++}`);
      values.push(updates.is_active);
    }
    if (updates.last_seen !== undefined) {
      setClauses.push(`last_seen = $${paramIndex++}`);
      values.push(updates.last_seen);
    }
    if (updates.preferences !== undefined) {
      setClauses.push(`preferences = $${paramIndex++}`);
      values.push(JSON.stringify(updates.preferences));
    }
    if (updates.password !== undefined) {
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(updates.password, salt);
      setClauses.push(`password = $${paramIndex++}`);
      values.push(hashed);
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, username, email, avatar, is_active, last_seen, preferences, created_at, updated_at`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Compare password against hash
   */
  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },

  /**
   * Strip password from user object
   */
  getPublicProfile(user) {
    if (!user) return null;
    const { password, ...publicUser } = user;
    return publicUser;
  }
};

export default User;