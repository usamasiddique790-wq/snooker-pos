const express = require("express");

const {
  getSalesReport,
  getInvoiceDetail,
} = require("../controllers/report.controller");

const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/sales", verifyToken, getSalesReport);
router.get("/invoice/:id", verifyToken, getInvoiceDetail);

module.exports = router;