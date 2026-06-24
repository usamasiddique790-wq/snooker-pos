const pool = require("../db");

const getSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        error: "Start and end dates are required",
      });
    }
const expensesResult = await pool.query(
  `
  SELECT COALESCE(SUM(amount), 0) AS total_expenses
  FROM expenses
  WHERE expense_date BETWEEN $1 AND $2
  `,
  [start, end]
);
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
const creditPaymentResult = await pool.query(
  `
  SELECT COALESCE(SUM(amount), 0) AS total_credit_payments
  FROM credit_transactions
  WHERE transaction_type = 'payment'
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
    const isSingleDayReport = start === end;
    const gameRevenue = Number(summaryResult.rows[0].game_revenue);
    const productsRevenue = Number(productsResult.rows[0].products_revenue);
    const totalCredit = Number(creditResult.rows[0].total_credit);
const totalCreditPayments = Number(
  creditPaymentResult.rows[0].total_credit_payments
);
const totalExpenses = Number(expensesResult.rows[0].total_expenses);

const totalRevenue = gameRevenue + productsRevenue;

const netCash = isSingleDayReport
  ? totalRevenue - totalCredit + totalCreditPayments - totalExpenses
  : totalRevenue + totalCreditPayments - totalExpenses;
    res.json({
  start,
  end,

  gameRevenue,
  productsRevenue,

  totalRevenue,

  totalCredit,

  totalCreditPayments,

  totalExpenses,

  netCash,

  completedSessions: Number(
    summaryResult.rows[0].completed_sessions
  ),

  invoices: invoicesResult.rows,
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        error: "Month and year are required",
      });
    }

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;

    const endDateResult = await pool.query(
      `SELECT (DATE_TRUNC('month', $1::date) + INTERVAL '1 month - 1 day')::date AS end_date`,
      [startDate]
    );

    const endDate = endDateResult.rows[0].end_date;

    const salesResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(amount), 0) AS game_revenue,
        COUNT(*) AS completed_sessions
      FROM sessions
      WHERE status = 'completed'
      AND DATE(end_time) BETWEEN $1 AND $2
      `,
      [startDate, endDate]
    );

    const productsResult = await pool.query(
      `
      SELECT COALESCE(SUM(total), 0) AS products_revenue
      FROM session_products
      WHERE DATE(created_at) BETWEEN $1 AND $2
      `,
      [startDate, endDate]
    );

    const creditGivenResult = await pool.query(
      `
      SELECT COALESCE(SUM(amount), 0) AS credit_given
      FROM credit_transactions
      WHERE transaction_type = 'credit'
      AND DATE(created_at) BETWEEN $1 AND $2
      `,
      [startDate, endDate]
    );

    const creditReceivedResult = await pool.query(
      `
      SELECT COALESCE(SUM(amount), 0) AS credit_received
      FROM credit_transactions
      WHERE transaction_type = 'payment'
      AND DATE(created_at) BETWEEN $1 AND $2
      `,
      [startDate, endDate]
    );

    const expensesResult = await pool.query(
      `
      SELECT COALESCE(SUM(amount), 0) AS total_expenses
      FROM expenses
      WHERE expense_date BETWEEN $1 AND $2
      `,
      [startDate, endDate]
    );

    const gameRevenue = Number(salesResult.rows[0].game_revenue);
    const productsRevenue = Number(productsResult.rows[0].products_revenue);
    const totalRevenue = gameRevenue + productsRevenue;

    const creditGiven = Number(creditGivenResult.rows[0].credit_given);
    const creditReceived = Number(creditReceivedResult.rows[0].credit_received);
    const totalExpenses = Number(expensesResult.rows[0].total_expenses);

    const netCash = totalRevenue + creditReceived - totalExpenses;

    res.json({
      month: Number(month),
      year: Number(year),
      startDate,
      endDate,
      gameRevenue,
      productsRevenue,
      totalRevenue,
      creditGiven,
      creditReceived,
      totalExpenses,
      netCash,
      completedSessions: Number(salesResult.rows[0].completed_sessions),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getYearlyReport = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        error: "Year is required",
      });
    }

    const monthlySalesResult = await pool.query(
      `
      WITH months AS (
        SELECT generate_series(1, 12) AS month
      ),
      session_sales AS (
        SELECT
          EXTRACT(MONTH FROM end_time)::int AS month,
          COALESCE(SUM(amount), 0) AS game_revenue,
          COUNT(*) AS completed_sessions
        FROM sessions
        WHERE status = 'completed'
        AND EXTRACT(YEAR FROM end_time)::int = $1
        GROUP BY EXTRACT(MONTH FROM end_time)::int
      ),
      product_sales AS (
        SELECT
          EXTRACT(MONTH FROM created_at)::int AS month,
          COALESCE(SUM(total), 0) AS products_revenue
        FROM session_products
        WHERE EXTRACT(YEAR FROM created_at)::int = $1
        GROUP BY EXTRACT(MONTH FROM created_at)::int
      ),
      credit_received AS (
        SELECT
          EXTRACT(MONTH FROM created_at)::int AS month,
          COALESCE(SUM(amount), 0) AS credit_received
        FROM credit_transactions
        WHERE transaction_type = 'payment'
        AND EXTRACT(YEAR FROM created_at)::int = $1
        GROUP BY EXTRACT(MONTH FROM created_at)::int
      ),
      expenses_monthly AS (
        SELECT
          EXTRACT(MONTH FROM expense_date)::int AS month,
          COALESCE(SUM(amount), 0) AS total_expenses
        FROM expenses
        WHERE EXTRACT(YEAR FROM expense_date)::int = $1
        GROUP BY EXTRACT(MONTH FROM expense_date)::int
      )
      SELECT
        months.month,
        COALESCE(session_sales.game_revenue, 0) AS game_revenue,
        COALESCE(product_sales.products_revenue, 0) AS products_revenue,
        (
          COALESCE(session_sales.game_revenue, 0)
          + COALESCE(product_sales.products_revenue, 0)
        ) AS total_revenue,
        COALESCE(credit_received.credit_received, 0) AS credit_received,
        COALESCE(expenses_monthly.total_expenses, 0) AS total_expenses,
        (
          COALESCE(session_sales.game_revenue, 0)
          + COALESCE(product_sales.products_revenue, 0)
          + COALESCE(credit_received.credit_received, 0)
          - COALESCE(expenses_monthly.total_expenses, 0)
        ) AS net_cash,
        COALESCE(session_sales.completed_sessions, 0) AS completed_sessions
      FROM months
      LEFT JOIN session_sales ON session_sales.month = months.month
      LEFT JOIN product_sales ON product_sales.month = months.month
      LEFT JOIN credit_received ON credit_received.month = months.month
      LEFT JOIN expenses_monthly ON expenses_monthly.month = months.month
      ORDER BY months.month ASC
      `,
      [Number(year)]
    );

    const months = monthlySalesResult.rows.map((row) => ({
      month: Number(row.month),
      gameRevenue: Number(row.game_revenue),
      productsRevenue: Number(row.products_revenue),
      totalRevenue: Number(row.total_revenue),
      creditReceived: Number(row.credit_received),
      totalExpenses: Number(row.total_expenses),
      netCash: Number(row.net_cash),
      completedSessions: Number(row.completed_sessions),
    }));

    const totals = months.reduce(
      (sum, item) => ({
        gameRevenue: sum.gameRevenue + item.gameRevenue,
        productsRevenue: sum.productsRevenue + item.productsRevenue,
        totalRevenue: sum.totalRevenue + item.totalRevenue,
        creditReceived: sum.creditReceived + item.creditReceived,
        totalExpenses: sum.totalExpenses + item.totalExpenses,
        netCash: sum.netCash + item.netCash,
        completedSessions: sum.completedSessions + item.completedSessions,
      }),
      {
        gameRevenue: 0,
        productsRevenue: 0,
        totalRevenue: 0,
        creditReceived: 0,
        totalExpenses: 0,
        netCash: 0,
        completedSessions: 0,
      }
    );

    res.json({
      year: Number(year),
      months,
      totals,
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
  getMonthlyReport,
  getYearlyReport,
};