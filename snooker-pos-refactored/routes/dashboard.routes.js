const express = require("express");
const { getTodayDashboard } = require("../controllers/dashboard.controller");
const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/today", verifyToken, getTodayDashboard);

module.exports = router;