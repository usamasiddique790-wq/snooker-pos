const express = require("express");
const verifyToken = require("../middleware/auth.middleware");
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/users/create", verifyToken, createUser);
router.get("/users", verifyToken, getUsers);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

module.exports = router;
