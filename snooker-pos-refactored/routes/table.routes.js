const express = require("express");
const verifyToken = require("../middleware/auth.middleware");
const {
  createTable,
  getTables,
  getLiveTables,
} = require("../controllers/table.controller");

const router = express.Router();

router.post("/snooker-tables", createTable);
router.get("/snooker-tables", getTables);
router.get("/tables/live", verifyToken, getLiveTables);

module.exports = router;
