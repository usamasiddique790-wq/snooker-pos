const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { JWT_SECRET } = require("../config/jwt");

const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, hashedPassword, "admin"]
    );

    res.json({
      message: "Admin created successfully",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAdmin,
  login,
};
