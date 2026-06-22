const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:12345@127.0.0.1:5432/pos_db",
});

module.exports = pool;