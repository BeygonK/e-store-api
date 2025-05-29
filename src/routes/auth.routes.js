const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  registerAdmin,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);

// Temporary admin registration route (REMOVE THIS IN PRODUCTION)
router.post("/register-admin", registerAdmin);

module.exports = router;
