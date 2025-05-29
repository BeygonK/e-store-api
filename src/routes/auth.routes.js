const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

// Apply rate limiting to auth routes
router.use(authLimiter);

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
