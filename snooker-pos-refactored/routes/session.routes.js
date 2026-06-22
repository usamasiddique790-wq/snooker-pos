const express = require("express");
const verifyToken = require("../middleware/auth.middleware");
const {
  startSession,
  endSession,
  getSessions,
  getLiveSession,
} = require("../controllers/session.controller");

const router = express.Router();

router.post("/sessions/start", verifyToken, startSession);
router.post("/sessions/end", verifyToken, endSession);
router.get("/sessions", verifyToken, getSessions);
router.get("/sessions/live/:id", getLiveSession);

module.exports = router;
