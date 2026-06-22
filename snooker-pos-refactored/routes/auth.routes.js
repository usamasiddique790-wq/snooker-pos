const express = require("express");
const { createAdmin, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", login);
router.post("/users/create-admin", createAdmin);

module.exports = router;
