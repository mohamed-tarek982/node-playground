const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
};

const DB_NAME = process.env.DB_NAME || "shop";

const sequelize = new Sequelize(DB_NAME, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: "mysql",
  logging: false,
  pool: { max: 10 },
  dialectOptions: { decimalNumbers: true }, // DECIMAL as numbers, not strings
});

// Sequelize can't create the database itself, so use a raw connection first
const createDatabase = async () => {
  const connection = await mysql.createConnection(config);
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  } finally {
    await connection.end();
  }
};

module.exports = { sequelize, createDatabase };


