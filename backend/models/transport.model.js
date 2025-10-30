const pool = require('../config/database');

class TransportModel {
  // Create a new transport option
  static async create(transportData) {
    try {
      const { source_id, dest_id, mode, base_cost, duration, comfort_level } = transportData;
      const [result] = await pool.execute(
        'INSERT INTO TransportOption (source_id, dest_id, mode, base_cost, duration, comfort_level) VALUES (?, ?, ?, ?, ?, ?)',
        [source_id, dest_id, mode, base_cost, duration, comfort_level]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get transport options between two destinations
  static async findByRoute(sourceId, destId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM TransportOption WHERE source_id = ? AND dest_id = ?',
        [sourceId, destId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all transport options
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM TransportOption');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Find by ID
  static async findById(transId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM TransportOption WHERE trans_id = ?',
        [transId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TransportModel;

