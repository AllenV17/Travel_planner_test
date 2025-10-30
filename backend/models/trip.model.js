const pool = require('../config/database');

class TripModel {
  // Create a new trip
  static async create(tripData) {
    try {
      const { user_id, source_id, dest_id, selected_mode, total_cost, total_duration, comfort_score } = tripData;
      const [result] = await pool.execute(
        'INSERT INTO Trip (user_id, source_id, dest_id, selected_mode, total_cost, total_duration, comfort_score, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [user_id, source_id, dest_id, selected_mode, total_cost, total_duration, comfort_score]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get all trips for a user
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT t.*, 
                s.name as source_name, s.city as source_city, s.state as source_state,
                d.name as dest_name, d.city as dest_city, d.state as dest_state
         FROM Trip t
         JOIN Destination s ON t.source_id = s.dest_id
         JOIN Destination d ON t.dest_id = d.dest_id
         WHERE t.user_id = ? 
         ORDER BY t.created_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a single trip by ID
  static async findById(tripId, userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT t.*, 
                s.name as source_name, s.city as source_city, s.state as source_state,
                d.name as dest_name, d.city as dest_city, d.state as dest_state
         FROM Trip t
         JOIN Destination s ON t.source_id = s.dest_id
         JOIN Destination d ON t.dest_id = d.dest_id
         WHERE t.trip_id = ? AND t.user_id = ?`,
        [tripId, userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a trip
  static async delete(tripId, userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM Trip WHERE trip_id = ? AND user_id = ?',
        [tripId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TripModel;

