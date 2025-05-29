const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// TODO: Add product controller functions
// For now, we'll add placeholder routes
router.get("/", (req, res) => {
  res.json({ message: "Get all products" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "Get single product" });
});

router.post("/", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Create product" });
});

router.put("/:id", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Update product" });
});

router.delete("/:id", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Delete product" });
});

module.exports = router;
