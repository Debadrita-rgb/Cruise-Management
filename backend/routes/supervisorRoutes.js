const express = require("express");
const router = express.Router();
const StationaryOrder = require("../models/StationaryOrder");
const jsonwebtoken = require("../middleware/auth")("headcook");
const { generateToken, jwtAuthMiddleware } = require("../middleware/jwt");
const Stationary = require("../models/Stationary");
const User = require("../models/user");
const Notification = require("../models/Notification");

router.get("/dashboardData", jwtAuthMiddleware, async (req, res) => {
  try {
    const personalId = req.user.id;
    const acceptedItems = await StationaryOrder.countDocuments({
      supervisorId: personalId,
      status: { $in: ["Accepted"] },
    });

    res.status(200).json({
      success: true,
      acceptedItems,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/showname_navbar", jwtAuthMiddleware, async (req, res) => {
  try {
    const supervisor = await User.findById(req.user.id).select(
      "name email role profilePic"
    );
    if (!supervisor) {
      return res.status(404).json({ message: "supervisor not found" });
    }

    res.status(200).json({ success: true, supervisor });
  } catch (err) {
    console.error("Error fetching supervisor profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-ordered-orders", jwtAuthMiddleware, async (req, res) => {
  try {
    const orderedOrders = await StationaryOrder.find({
      serviceType: "Stationary",
      status: { $in: ["Ordered"] },
    })
      .populate("voyagerId", "name")
      .sort({ createdAt: -1 });

    res.json({ orders: orderedOrders });
  } catch (err) {
    console.error("Error fetching ordered orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/accept-order/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    // Step 1: Find the order
    const order = await StationaryOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Step 2: Update each item's stock
    for (const item of order.items) {
      const stationaryItem = await Stationary.findOne({ name: item.name });

      if (!stationaryItem) {
        return res
          .status(404)
          .json({ message: `Stationary item ${item.name} not found` });
      }

      // Check if enough quantity is available
      if (stationaryItem.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough quantity for ${item.name}` });
      }

      // Decrease quantity
      stationaryItem.quantity -= item.quantity;
      await stationaryItem.save();
    }

    // Step 3: Update order status
    order.status = ["Accepted"];
    order.supervisorId = req.user.id;
    order.items.forEach((i) => (i.status = "Accepted"));
    await order.save();

    await Notification.create({
      userId: order.voyagerId,
      type: "Stationary",
      message: "Your Stationary Item has been accepted by the supervisor!",
      bookingId: order._id,
      isRead: false,
    });

    res.json({ message: "Order accepted and stock updated", order });
  } catch (err) {
    console.error("Error accepting order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// View accepted Stationary Orders
router.get("/get-accepted-orders", jwtAuthMiddleware, async (req, res) => {
  try {
    const personalId = req.user.id;
    const orderedOrders = await StationaryOrder.find({
      serviceType: "Stationary",
      status: { $in: ["Accepted"] },
      supervisorId: personalId,
    })
      .populate("voyagerId", "name")
      .sort({ createdAt: -1 });
    res.json({ orders: orderedOrders });
  } catch (err) {
    console.error("Error fetching ordered orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(`/get-single-supervisor/:id`, jwtAuthMiddleware, async (req, res) => {
  try {
    const item = await User.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error("GET single error:", error);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

router.put("/update-supervisor/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Item not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.password) user.password = req.body.password;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
});

module.exports = router;
