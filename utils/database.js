const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
};

const DB_NAME = process.env.DB_NAME || "shop";

const pool = mysql.createPool({
  ...config,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true, // return DECIMAL columns as numbers instead of strings
});

// create the database and product table if they don't exist
const init = async () => {
  // connect without a database, since it may not exist yet
  const connection = await mysql.createConnection(config);
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`${DB_NAME}\`.product (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        imageUrl VARCHAR(2048),
        description TEXT
      )
    `);
  } finally {
    await connection.end();
  }
};

module.exports = { pool, init };
