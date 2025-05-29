const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// TODO: Add order controller functions
// For now, we'll add placeholder routes
router.get("/", protect, (req, res) => {
  res.json({ message: "Get all orders" });
});

router.get("/:id", protect, (req, res) => {
  res.json({ message: "Get single order" });
});

router.post("/", protect, (req, res) => {
  res.json({ message: "Create order" });
});

router.put("/:id", protect, (req, res) => {
  res.json({ message: "Update order" });
});

router.delete("/:id", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Delete order" });
});

module.exports = router;
