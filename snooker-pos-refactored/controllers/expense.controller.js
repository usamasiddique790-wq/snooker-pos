const pool = require("../db");

const addExpense = async (req, res) => {
  try {
    const { title, amount, notes } = req.body;

    const result = await pool.query(
      `
      INSERT INTO expenses (
        title,
        amount,
        notes
      )
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [title, amount, notes]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM expenses
      ORDER BY expense_date DESC, id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM expenses WHERE id = $1",
      [id]
    );

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
};