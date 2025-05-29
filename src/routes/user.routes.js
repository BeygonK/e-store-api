const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// TODO: Add user controller functions
// For now, we'll add placeholder routes
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Get user profile" });
});

router.put("/profile", protect, (req, res) => {
  res.json({ message: "Update user profile" });
});

router.get("/", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Get all users" });
});

router.get("/:id", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Get single user" });
});

router.put("/:id", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Update user" });
});

router.delete("/:id", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Delete user" });
});

module.exports = router;
