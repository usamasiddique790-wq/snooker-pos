const express = require("express");
const { getSalesReport } = require("../controllers/report.controller");
const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/sales", verifyToken, getSalesReport);

module.exports = router;