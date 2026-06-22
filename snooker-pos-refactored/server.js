const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const tableRoutes = require("./routes/table.routes");
const sessionRoutes = require("./routes/session.routes");
const productRoutes = require("./routes/product.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("POS API running");
});

app.use(authRoutes);
app.use(userRoutes);
app.use(tableRoutes);
app.use(sessionRoutes);
app.use(productRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
