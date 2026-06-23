const pool = require("../db");

const createTable = async (req, res) => {
  try {
    const {
      table_name,
      hourly_rate,
      one_ball_rate,
      six_ball_rate,
      ten_ball_rate,
      full_frame_rate,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO snooker_tables
      (
        table_name,
        hourly_rate,
        one_ball_rate,
        six_ball_rate,
        ten_ball_rate,
        full_frame_rate
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        table_name,
        hourly_rate,
        one_ball_rate,
        six_ball_rate,
        ten_ball_rate,
        full_frame_rate,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTables = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM snooker_tables
      ORDER BY id ASC
    `);

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
        snooker_tables.one_ball_rate,
        snooker_tables.six_ball_rate,
        snooker_tables.ten_ball_rate,
        snooker_tables.full_frame_rate,
        snooker_tables.status AS table_status,

        sessions.id AS session_id,
        sessions.start_time,
        sessions.status AS session_status,
        sessions.billing_type,
        sessions.billing_rate,

        CASE
          WHEN sessions.id IS NOT NULL
          THEN ROUND(
            (EXTRACT(EPOCH FROM (NOW() - sessions.start_time)) / 60)::numeric,
            0
          )
          ELSE 0
        END AS duration_minutes,

        CASE
          WHEN sessions.id IS NULL THEN 0

          WHEN sessions.billing_type = 'century'
          THEN ROUND(
            (
              (EXTRACT(EPOCH FROM (NOW() - sessions.start_time)) / 3600)
              * sessions.billing_rate
            )::numeric,
            2
          )

          ELSE sessions.billing_rate
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
const updateTable = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      table_name,
      hourly_rate,
      one_ball_rate,
      six_ball_rate,
      ten_ball_rate,
      full_frame_rate,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE snooker_tables
      SET
        table_name = $1,
        hourly_rate = $2,
        one_ball_rate = $3,
        six_ball_rate = $4,
        ten_ball_rate = $5,
        full_frame_rate = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        table_name,
        hourly_rate,
        one_ball_rate,
        six_ball_rate,
        ten_ball_rate,
        full_frame_rate,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Table not found" });
    }

    res.json({
      message: "Table rates updated successfully",
      table: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createTable,
  getTables,
  getLiveTables,
  updateTable,
};