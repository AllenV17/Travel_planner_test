const pool = require('../config/database');

class UserModel {
  // Create a new user
  static async create(userData) {
    try {
      const { name, email, password, phone } = userData;
      const [result] = await pool.execute(
        'INSERT INTO User (name, email, password, phone) VALUES (?, ?, ?, ?)',
        [name, email, password, phone]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM User WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT user_id, name, email, phone FROM User WHERE user_id = ?',
        [userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async update(userId, userData) {
    try {
      const { name, phone } = userData;
      const [result] = await pool.execute(
        'UPDATE User SET name = ?, phone = ? WHERE user_id = ?',
        [name, phone, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;

