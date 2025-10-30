const pool = require('../config/database');

class DestinationModel {
  // Create a new destination
  static async create(destData) {
    try {
      const { name, state, city, pincode } = destData;
      const [result] = await pool.execute(
        'INSERT INTO Destination (name, state, city, pincode) VALUES (?, ?, ?, ?)',
        [name, state, city, pincode]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get all destinations
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM Destination ORDER BY name');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Find destination by ID
  static async findById(destId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM Destination WHERE dest_id = ?',
        [destId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Search destinations by name
  static async searchByName(searchTerm) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM Destination WHERE name LIKE ? ORDER BY name',
        [`%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DestinationModel;

