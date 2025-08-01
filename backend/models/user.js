const pool = require("../config/db");

class User {
  static async create({ username, email, password }) {
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }
}

module.exports = User;
