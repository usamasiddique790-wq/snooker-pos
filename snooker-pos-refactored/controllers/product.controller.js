const pool = require("../db");

const getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can add products" });
    }

    const { name, price, stock, category } = req.body;

    const result = await pool.query(
      `INSERT INTO products
       (name, price, stock, category)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [name, price, stock, category]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can edit products" });
    }

    const { id } = req.params;
    const { name, barcode, price, stock, category } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           barcode = $2,
           price = $3,
           stock = $4,
           category = $5
       WHERE id = $6
       RETURNING *`,
      [name, barcode, price, stock, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can delete products" });
    }

    const { id } = req.params;

    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addProductToSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const { product_id, quantity } = req.body;

    const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [product_id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult.rows[0];

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    const total = parseFloat(product.price) * quantity;

    const itemResult = await pool.query(
      `INSERT INTO session_products
       (session_id, product_id, quantity, price, total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [session_id, product_id, quantity, product.price, total]
    );

    await pool.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [quantity, product_id]);

    res.json({
      message: "Product added to session",
      item: itemResult.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getLowStockProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE stock <= 5
      ORDER BY stock ASC
      `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getSessionProducts = async (req, res) => {
  try {
    const { session_id } = req.params;

    const result = await pool.query(
      `SELECT 
        session_products.*,
        products.name,
        products.category
       FROM session_products
       JOIN products ON session_products.product_id = products.id
       WHERE session_products.session_id = $1
       ORDER BY session_products.id DESC`,
      [session_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToSession,
  getSessionProducts,
  getLowStockProducts,
};
