const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let db;

// Connect once at startup and reuse the same connection pool everywhere
const mongoConnect = async () => {
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME || "shop");
  return db;
};

const getDb = () => {
  if (!db) throw new Error("Database not connected. Call mongoConnect() first.");
  return db;
};

module.exports = { mongoConnect, getDb };
