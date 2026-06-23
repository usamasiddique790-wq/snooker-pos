const pool = require("../db");

const getSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        error: "Start and end dates are required",
      });
    }

    const summaryResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(amount), 0) AS game_revenue,
        COUNT(*) AS completed_sessions
      FROM sessions
      WHERE status = 'completed'
      AND DATE(end_time) BETWEEN $1 AND $2
      `,
      [start, end]
    );

    const productsResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(sp.total), 0) AS products_revenue
      FROM session_products sp
      WHERE DATE(sp.created_at) BETWEEN $1 AND $2
      `,
      [start, end]
    );

    const creditResult = await pool.query(
      `
      SELECT COALESCE(SUM(amount), 0) AS total_credit
      FROM credit_transactions
      WHERE transaction_type = 'credit'
      AND DATE(created_at) BETWEEN $1 AND $2
      `,
      [start, end]
    );

    const invoicesResult = await pool.query(
      `
      SELECT
        s.id,
        s.table_id,
        s.start_time,
        s.end_time,
        s.duration_minutes,
        COALESCE(s.amount, 0) AS game_amount,
        COALESCE(SUM(sp.total), 0) AS products_amount,
        (COALESCE(s.amount, 0) + COALESCE(SUM(sp.total), 0)) AS grand_total
      FROM sessions s
      LEFT JOIN session_products sp ON sp.session_id = s.id
      WHERE s.status = 'completed'
      AND DATE(s.end_time) BETWEEN $1 AND $2
      GROUP BY s.id
      ORDER BY s.end_time DESC
      `,
      [start, end]
    );

    const gameRevenue = Number(summaryResult.rows[0].game_revenue);
    const productsRevenue = Number(productsResult.rows[0].products_revenue);
    const totalCredit = Number(creditResult.rows[0].total_credit);

    res.json({
      start,
      end,
      gameRevenue,
      productsRevenue,
      totalRevenue: gameRevenue + productsRevenue,

      // frontend isi naam se read kar raha hai
      totalCredit,

      completedSessions: Number(summaryResult.rows[0].completed_sessions),
      invoices: invoicesResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getInvoiceDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const sessionResult = await pool.query(
      `
      SELECT *
      FROM sessions
      WHERE id = $1
      `,
      [id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const productsResult = await pool.query(
      `
      SELECT
        sp.quantity,
        sp.price,
        sp.total,
        p.name
      FROM session_products sp
      JOIN products p ON p.id = sp.product_id
      WHERE sp.session_id = $1
      ORDER BY sp.id ASC
      `,
      [id]
    );

    const session = sessionResult.rows[0];

    const gameTotal = Number(session.amount || 0);
    const productsTotal = productsResult.rows.reduce(
      (sum, item) => sum + Number(item.total),
      0
    );

    res.json({
      session,
      products: productsResult.rows,
      game_total: gameTotal,
      products_total: productsTotal,
      grand_total: gameTotal + productsTotal,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSalesReport,
  getInvoiceDetail,
};
