const pool = require("../db");

const createTable = async (req, res) => {
  try {
    const { table_name, hourly_rate } = req.body;

    const result = await pool.query(
      "INSERT INTO snooker_tables (table_name, hourly_rate) VALUES ($1, $2) RETURNING *",
      [table_name, hourly_rate]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTables = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM snooker_tables ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLiveTables = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        snooker_tables.id AS table_id,
        snooker_tables.table_name,
        snooker_tables.hourly_rate,
        snooker_tables.status AS table_status,
        sessions.id AS session_id,
        sessions.start_time,
        sessions.status AS session_status,
        CASE 
          WHEN sessions.id IS NULL THEN 0
          ELSE ROUND(EXTRACT(EPOCH FROM (NOW() - sessions.start_time)) / 60)
        END AS duration_minutes,
        CASE 
          WHEN sessions.id IS NULL THEN 0
          ELSE ROUND(
            (EXTRACT(EPOCH FROM (NOW() - sessions.start_time)) / 3600) 
            * snooker_tables.hourly_rate,
            2
          )
        END AS live_amount
      FROM snooker_tables
      LEFT JOIN sessions 
        ON sessions.table_id = snooker_tables.id
        AND sessions.status = 'running'
      ORDER BY snooker_tables.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTable,
  getTables,
  getLiveTables,
};
