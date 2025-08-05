const db = require("../config/db");

const Product = {
  getAll: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM products");
      return rows;
    } catch (err) {
      console.error("Database error in getAll:", err);
      throw err;
    }
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const [result] = await db.query("INSERT INTO products SET ?", {
      name: data.name,
      price: data.price,
      description: data.description,
      image_url: data.image_url,
    });
    return result;
  },

  update: async (id, data) => {
    const [result] = await db.query("UPDATE products SET ? WHERE id = ?", [
      data,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
    return result;
  },
};

module.exports = Product;
