const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const Order = require("../models/Order");

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of the product
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product at the time of order
 *
 *     ShippingAddress:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - state
 *         - country
 *         - zipCode
 *       properties:
 *         street:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State/Province
 *         country:
 *           type: string
 *           description: Country name
 *         zipCode:
 *           type: string
 *           description: ZIP/Postal code
 *
 *     Order:
 *       type: object
 *       required:
 *         - items
 *         - totalAmount
 *         - shippingAddress
 *         - paymentMethod
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: List of ordered items
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: Total order amount
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           default: pending
 *           description: Order status
 *         paymentStatus:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           default: pending
 *           description: Payment status
 *         paymentMethod:
 *           type: string
 *           description: Payment method used
 *         trackingNumber:
 *           type: string
 *           description: Order tracking number
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin) or user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               shippingAddress:
 *                 $ref: '#/components/schemas/ShippingAddress'
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */

// Get all orders (admin) or user's orders
router.get("/", protect, async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user.id };
    const orders = await Order.find(query)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Create new order
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 *   put:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, completed, failed, refunded]
 *               trackingNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Order not found
 *   delete:
 *     summary: Delete order (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Order not found
 */

// Get single order
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is admin or the order owner
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Update order status (admin only)
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus, trackingNumber },
      { new: true, runValidators: true }
    )
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Delete order (admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
