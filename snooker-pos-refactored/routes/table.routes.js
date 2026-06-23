const express = require("express");
const verifyToken = require("../middleware/auth.middleware");
const {
  createTable,
  getTables,
  getLiveTables,
  updateTable,
} = require("../controllers/table.controller");

const router = express.Router();

router.post("/snooker-tables", createTable);
router.get("/snooker-tables", getTables);
router.get("/tables/live", verifyToken, getLiveTables);
router.put("/:id", verifyToken, updateTable);

module.exports = router;
