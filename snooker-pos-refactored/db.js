const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "snooker_pos",
  password: process.env.DB_PASSWORD || "password",
  port: Number(process.env.DB_PORT) || 5432,
});

module.exports = pool;
