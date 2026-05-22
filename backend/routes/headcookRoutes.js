const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jsonwebtoken = require("../middleware/auth")("headcook");
const { generateToken, jwtAuthMiddleware } = require("../middleware/jwt");
const CateringOrder = require("../models/CateringOrder");
const User = require("../models/user");
const Notification = require("../models/Notification");


router.get("/dashboardData", jwtAuthMiddleware, async (req, res) => {
  try {
    const personalId = req.user.id;
    const acceptedItems = await CateringOrder.countDocuments({
      headcookId: personalId,
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
    const headcook = await User.findById(req.user.id).select(
      "name email role profilePic"
    );
    if (!headcook) {
      return res.status(404).json({ message: "headcook not found" });
    }

    res.status(200).json({ success: true, headcook });
  } catch (err) {
    console.error("Error fetching headcook profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-ordered-orders", jwtAuthMiddleware, async (req, res) => {
  try {
    const orderedOrders = await CateringOrder.find({
      serviceType: "Catering",
      status: { $in: ["Ordered"] },
    }).populate("voyagerId", "name");

    res.json({ orders: orderedOrders });
  } catch (err) {
    console.error("Error fetching ordered orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/accept-order/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    // Find the order by ID and update its status and headcookId
    const order = await CateringOrder.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          headcookId: req.user.id, // Add headcookId
          status: ["Accepted"], // Set the overall order status to "Accepted"
          "items.$[].status": "Accepted", // Update status of each item in the items array
        },
      },
      { new: true } // To return the updated order
    );
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Notification.create({
      userId: order.voyagerId,
      type: "Catering",
      message: "Your Catering Item has been accepted by the headcook!",
      bookingId: order._id,
      isRead: false,
    });

    res.json({ message: "Order accepted", order });
  } catch (err) {
    console.error("Error accepting order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// View accepted Catering Orders
router.get("/get-accepted-orders", jwtAuthMiddleware, async (req, res) => {
  try {
    const personalId = req.user.id;

    const orderedOrders = await CateringOrder.find({
      serviceType: "Catering",
      status: { $in: ["Accepted"] },
      headcookId: personalId,
    })
      .populate("voyagerId", "name")
      .sort({ createdAt: -1 });

    res.json({ orders: orderedOrders });
  } catch (err) {
    console.error("Error fetching ordered orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(`/get-single-headcook/:id`, jwtAuthMiddleware, async (req, res) => {
  try {
    const item = await User.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error("GET single error:", error);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

router.put("/update-headcook/:id", jwtAuthMiddleware, async (req, res) => {
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
