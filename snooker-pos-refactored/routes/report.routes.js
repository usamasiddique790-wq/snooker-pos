const express = require("express");

const {
  getSalesReport,
  getInvoiceDetail,
  getMonthlyReport,
  getYearlyReport,
} = require("../controllers/report.controller");

const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/sales", verifyToken, getSalesReport);
router.get("/invoice/:id", verifyToken, getInvoiceDetail);
router.get("/monthly", verifyToken, getMonthlyReport);
router.get("/yearly", verifyToken, getYearlyReport);

module.exports = router;