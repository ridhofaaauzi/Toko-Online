const pool = require("../config/db");

const User = {
  async create({ email, username, password }) {
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password) VALUES(?,?,?)",
      [username, email, password]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, username, email FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },
};

module.exports = User;
