const pool = require("../db");

const getTodayDashboard = async (req, res) => {
  try {
    const gameRevenueResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS game_revenue
      FROM sessions
      WHERE DATE(end_time) = CURRENT_DATE
      AND status = 'completed'
    `);

    const productsRevenueResult = await pool.query(`
      SELECT COALESCE(SUM(total), 0) AS products_revenue
      FROM session_products
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    const sessionsResult = await pool.query(`
      SELECT COUNT(*) AS total_sessions
      FROM sessions
      WHERE DATE(end_time) = CURRENT_DATE
      AND status = 'completed'
    `);

    const activeTablesResult = await pool.query(`
      SELECT COUNT(*) AS active_tables
      FROM sessions
      WHERE status = 'running'
    `);

    const topProductsResult = await pool.query(`
      SELECT
        p.name,
        SUM(sp.quantity) AS sold,
        SUM(sp.total) AS revenue
      FROM session_products sp
      JOIN products p ON p.id = sp.product_id
      WHERE DATE(sp.created_at) = CURRENT_DATE
      GROUP BY p.name
      ORDER BY sold DESC
      LIMIT 5
    `);

    const gameRevenue = Number(gameRevenueResult.rows[0].game_revenue);
    const productsRevenue = Number(
      productsRevenueResult.rows[0].products_revenue
    );

    res.json({
      gameRevenue,
      productsRevenue,
      totalRevenue: gameRevenue + productsRevenue,
      completedSessions: Number(sessionsResult.rows[0].total_sessions),
      activeTables: Number(activeTablesResult.rows[0].active_tables),
      topProducts: topProductsResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTodayDashboard,
};