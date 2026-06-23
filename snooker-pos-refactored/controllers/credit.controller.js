const pool = require("../db");

const addCredit = async (req, res) => {
  try {
    const { customer_name, amount, invoice_id, notes } = req.body;

    if (!customer_name || !amount) {
      return res.status(400).json({
        error: "Customer name and amount are required",
      });
    }

    const existing = await pool.query(
      "SELECT * FROM credits WHERE LOWER(customer_name) = LOWER($1)",
      [customer_name]
    );

    let credit;

    if (existing.rows.length > 0) {
      const updated = await pool.query(
        `
        UPDATE credits
        SET total_amount = total_amount + $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
        `,
        [amount, existing.rows[0].id]
      );

      credit = updated.rows[0];
    } else {
      const created = await pool.query(
        `
        INSERT INTO credits (customer_name, total_amount)
        VALUES ($1, $2)
        RETURNING *
        `,
        [customer_name, amount]
      );

      credit = created.rows[0];
    }

    await pool.query(
      `
      INSERT INTO credit_transactions
      (credit_id, invoice_id, amount, transaction_type, notes)
      VALUES ($1, $2, $3, 'credit', $4)
      `,
      [credit.id, invoice_id || null, amount, notes || null]
    );

    res.json({
      message: "Credit added successfully",
      credit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCredits = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM credits
      ORDER BY total_amount DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addPayment = async (req, res) => {
  try {
    const { credit_id, amount, notes } = req.body;

    if (!credit_id || !amount) {
      return res.status(400).json({
        error: "Credit ID and amount are required",
      });
    }

    const updated = await pool.query(
      `
      UPDATE credits
      SET total_amount = GREATEST(total_amount - $1, 0),
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [amount, credit_id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: "Credit customer not found" });
    }

    await pool.query(
      `
      INSERT INTO credit_transactions
      (credit_id, amount, transaction_type, notes)
      VALUES ($1, $2, 'payment', $3)
      `,
      [credit_id, amount, notes || null]
    );

    res.json({
      message: "Payment added successfully",
      credit: updated.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCreditTransactions = async (req, res) => {
  try {
    const { credit_id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM credit_transactions
      WHERE credit_id = $1
      ORDER BY id DESC
      `,
      [credit_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteCredit = async (req, res) => {
  try {
    const { credit_id } = req.params;

    await pool.query("DELETE FROM credits WHERE id = $1", [credit_id]);

    res.json({ message: "Credit deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  addCredit,
  getCredits,
  addPayment,
  getCreditTransactions,
  deleteCredit,
};