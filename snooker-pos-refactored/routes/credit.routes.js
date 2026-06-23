const express = require("express");
const verifyToken = require("../middleware/auth.middleware");

const {
  addCredit,
  getCredits,
  addPayment,
  deleteCredit,
  getCreditTransactions,
} = require("../controllers/credit.controller");

const router = express.Router();

router.post("/add", verifyToken, addCredit);
router.get("/", verifyToken, getCredits);
router.post("/payment", verifyToken, addPayment);
router.delete("/:credit_id", verifyToken, deleteCredit);
router.get("/:credit_id/transactions", verifyToken, getCreditTransactions);

module.exports = router;