const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const JWT_SECRET = "snooker_pos_secret_key";
app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

app.get("/", (req, res) => {
  res.send("POS API running");
});
// User registration API (ADMIN)
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Admin user create API
app.post("/users/create-admin", async (req, res) => {
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
});
// User creation API (staff and cashier) - only admin can create users
app.post("/users/create", verifyToken, async (req, res) => {
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
});
// Add snooker table
app.post("/snooker-tables", async (req, res) => {
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
});
//login API (ADMIN)
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

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
});

// Get all users (only admin can view)
app.get("/users", verifyToken, async (req, res) => {
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
});
// Get all snooker tables
app.get("/snooker-tables", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM snooker_tables ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Start Game API
app.post("/sessions/start", verifyToken, async (req, res) => {
  try {
    const { table_id } = req.body;

    // Session create
    const sessionResult = await pool.query(
      `INSERT INTO sessions (table_id, start_time)
       VALUES ($1, NOW())
       RETURNING *`,
      [table_id]
    );

    // Table status update
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
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});
// End Game API
app.post("/sessions/end", verifyToken, async (req, res) => {
  try {
    const { session_id } = req.body;

    // Session find karo
    const sessionResult = await pool.query(
      "SELECT * FROM sessions WHERE id = $1",
      [session_id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const session = sessionResult.rows[0];

    // Table ka hourly rate lao
    const tableResult = await pool.query(
      "SELECT * FROM snooker_tables WHERE id = $1",
      [session.table_id]
    );

    const table = tableResult.rows[0];

    // Minutes calculate
    const durationMinutes = Math.round(
      (new Date() - new Date(session.start_time)) / (1000 * 60)
    );

    // Amount calculate
    const amount =
      (durationMinutes / 60) * parseFloat(table.hourly_rate);

    // Session update
    const updatedSession = await pool.query(
      `UPDATE sessions
       SET end_time = NOW(),
           duration_minutes = $1,
           amount = $2,
           status = 'completed'
       WHERE id = $3
       RETURNING *`,
      [durationMinutes, amount.toFixed(2), session_id]
    );

    // Table available karo
    await pool.query(
      `UPDATE snooker_tables
       SET status = 'available'
       WHERE id = $1`,
      [session.table_id]
    );

    res.json({
      message: "Game Ended Successfully",
      session: updatedSession.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});
app.get("/sessions", verifyToken, async (req, res) => {
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
});
app.get("/sessions/live/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sessionResult = await pool.query(
      "SELECT * FROM sessions WHERE id = $1",
      [id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const session = sessionResult.rows[0];

    const tableResult = await pool.query(
      "SELECT * FROM snooker_tables WHERE id = $1",
      [session.table_id]
    );

    const table = tableResult.rows[0];

    const minutes = Math.round(
      (new Date() - new Date(session.start_time)) / (1000 * 60)
    );

    const amount =
      (minutes / 60) * parseFloat(table.hourly_rate);

    res.json({
      table: table.table_name,
      duration_minutes: minutes,
      amount: amount.toFixed(2),
      status: session.status,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
app.get("/tables/live", verifyToken, async (req, res) => {
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
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});