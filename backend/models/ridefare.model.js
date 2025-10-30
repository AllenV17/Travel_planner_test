const pool = require('../config/database');

class RideFareModel {
  // Create a new ride fare comparison
  static async create(rideData) {
    try {
      const { trans_id, app_name, fare, estimated_time } = rideData;
      const [result] = await pool.execute(
        'INSERT INTO RideFare (trans_id, app_name, fare, estimated_time) VALUES (?, ?, ?, ?)',
        [trans_id, app_name, fare, estimated_time]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get ride fares for a specific transport option
  static async findByTransportId(transId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM RideFare WHERE trans_id = ? ORDER BY fare ASC',
        [transId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all ride fares
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM RideFare');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Find cheapest fare for a transport option
  static async findCheapest(transId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM RideFare WHERE trans_id = ? ORDER BY fare ASC LIMIT 1',
        [transId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update fare for a specific app and transport
  static async updateFare(transId, appName, fare, estimatedTime) {
    try {
      const [result] = await pool.execute(
        'UPDATE RideFare SET fare = ?, estimated_time = ? WHERE trans_id = ? AND app_name = ?',
        [fare, estimatedTime, transId, appName]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RideFareModel;

