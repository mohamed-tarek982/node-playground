const mongoose = require("mongoose");

// Connect once at startup; mongoose keeps and reuses the connection pool
const mongoConnect = () =>
  mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME || "shop",
  });

module.exports = { mongoConnect };
