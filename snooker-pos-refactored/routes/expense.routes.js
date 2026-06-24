const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");

const {
  addExpense,
  getExpenses,
  deleteExpense,
} = require("../controllers/expense.controller");

router.get("/", verifyToken, getExpenses);

router.post("/", verifyToken, addExpense);

router.delete("/:id", verifyToken, deleteExpense);

module.exports = router;