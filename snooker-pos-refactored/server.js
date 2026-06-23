const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboard.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const tableRoutes = require("./routes/table.routes");
const sessionRoutes = require("./routes/session.routes");
const productRoutes = require("./routes/product.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("POS API running");
});

app.use(authRoutes);
app.use(userRoutes);
app.use(tableRoutes);
app.use("/reports", reportRoutes);
app.use(sessionRoutes);
app.use(productRoutes);
app.use("/dashboard", dashboardRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
