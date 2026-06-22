const pool = require("../db");

const startSession = async (req, res) => {
  try {
    const { table_id } = req.body;

    const runningCheck = await pool.query(
      "SELECT * FROM sessions WHERE table_id = $1 AND status = 'running'",
      [table_id]
    );

    if (runningCheck.rows.length > 0) {
      return res.status(400).json({ error: "This table already has a running session" });
    }

    const sessionResult = await pool.query(
      `INSERT INTO sessions (table_id, start_time)
       VALUES ($1, NOW())
       RETURNING *`,
      [table_id]
    );

    await pool.query(
      `UPDATE snooker_tables
       SET status = 'running'
       WHERE id = $1`,
      [table_id]
    );

    res.json({
      message: "Game Started Successfully",
      session: sessionResult.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const endSession = async (req, res) => {
  try {
    const { session_id } = req.body;

    const sessionResult = await pool.query("SELECT * FROM sessions WHERE id = $1", [session_id]);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const session = sessionResult.rows[0];

    const tableResult = await pool.query("SELECT * FROM snooker_tables WHERE id = $1", [session.table_id]);
    const table = tableResult.rows[0];

    const durationMinutes = Math.round(
      (new Date() - new Date(session.start_time)) / (1000 * 60)
    );

    const gameAmount = (durationMinutes / 60) * parseFloat(table.hourly_rate);

    const updatedSession = await pool.query(
      `UPDATE sessions
       SET end_time = NOW(),
           duration_minutes = $1,
           amount = $2,
           status = 'completed'
       WHERE id = $3
       RETURNING *`,
      [durationMinutes, gameAmount.toFixed(2), session_id]
    );

    const productsResult = await pool.query(
      `SELECT
          sp.quantity,
          sp.price,
          sp.total,
          p.name
       FROM session_products sp
       JOIN products p ON p.id = sp.product_id
       WHERE sp.session_id = $1
       ORDER BY sp.id ASC`,
      [session_id]
    );

    const productsTotal = productsResult.rows.reduce(
      (sum, item) => sum + Number(item.total),
      0
    );

    const grandTotal = Number(gameAmount) + productsTotal;

    await pool.query(
      `UPDATE snooker_tables
       SET status = 'available'
       WHERE id = $1`,
      [session.table_id]
    );

    res.json({
      message: "Game Ended Successfully",
      session: updatedSession.rows[0],
      products: productsResult.rows,
      game_total: Number(gameAmount.toFixed(2)),
      products_total: Number(productsTotal.toFixed(2)),
      grand_total: Number(grandTotal.toFixed(2)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sessions.*,
        snooker_tables.table_name,
        snooker_tables.hourly_rate
      FROM sessions
      JOIN snooker_tables ON sessions.table_id = snooker_tables.id
      ORDER BY sessions.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLiveSession = async (req, res) => {
  try {
    const { id } = req.params;

    const sessionResult = await pool.query("SELECT * FROM sessions WHERE id = $1", [id]);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const session = sessionResult.rows[0];

    const tableResult = await pool.query("SELECT * FROM snooker_tables WHERE id = $1", [session.table_id]);
    const table = tableResult.rows[0];

    const minutes = Math.round(
      (new Date() - new Date(session.start_time)) / (1000 * 60)
    );

    const amount = (minutes / 60) * parseFloat(table.hourly_rate);

    res.json({
      table: table.table_name,
      duration_minutes: minutes,
      amount: amount.toFixed(2),
      status: session.status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  startSession,
  endSession,
  getSessions,
  getLiveSession,
};
