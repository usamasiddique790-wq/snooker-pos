const bcrypt = require("bcrypt");
const pool = require("../db");

const createUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can create users" });
    }

    const { username, password, role } = req.body;

    if (!["admin", "cashier", "staff"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at",
      [username, hashedPassword, role]
    );

    res.json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can view users" });
    }

    const result = await pool.query(
      "SELECT id, username, role, created_at FROM users ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can edit users" });
    }

    const { id } = req.params;
    const { username, password, role } = req.body;

    if (!["admin", "cashier", "staff"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    let result;

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);

      result = await pool.query(
        `UPDATE users
         SET username = $1, password = $2, role = $3
         WHERE id = $4
         RETURNING id, username, role, created_at`,
        [username, hashedPassword, role, id]
      );
    } else {
      result = await pool.query(
        `UPDATE users
         SET username = $1, role = $2
         WHERE id = $3
         RETURNING id, username, role, created_at`,
        [username, role, id]
      );
    }

    res.json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can delete users" });
    }

    const userId = req.params.id;

    await pool.query("DELETE FROM users WHERE id = $1 AND role != 'admin'", [userId]);

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
};
