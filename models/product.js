const crypto = require("crypto");
const { pool } = require("../utils/database");

class Product {
  constructor({ id, title, price, imageUrl, description }) {
    this.id = id || crypto.randomUUID();
    this.title = title?.trim();
    this.price = Number(price);
    this.imageUrl = imageUrl?.trim() || null;
    this.description = description?.trim() || null;
  }

  // returns a list of error messages; empty when valid
  validate() {
    const errors = [];
    if (!this.title) errors.push("Title is required.");
    if (!Number.isFinite(this.price) || this.price < 0) {
      errors.push("Price must be a non-negative number.");
    }
    return errors;
  }

  async save() {
    await pool.execute(
      "INSERT INTO product (id, title, price, imageUrl, description) VALUES (?, ?, ?, ?, ?)",
      [this.id, this.title, this.price, this.imageUrl, this.description],
    );
    return this;
  }

  static async fetchAll() {
    const [rows] = await pool.execute("SELECT * FROM product");
    return rows.map((row) => new Product(row));
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM product WHERE id = ?", [
      id,
    ]);
    return rows[0] ? new Product(rows[0]) : null;
  }
}

module.exports = Product;
