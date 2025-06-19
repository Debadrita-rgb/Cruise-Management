const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { generateToken, jwtAuthMiddleware } = require("../middleware/jwt");
// Importing User model
const jsonwebtoken = require("../middleware/auth")("VOYAGER");
const CateringOrder = require("../models/CateringOrder");
const StationaryOrder = require("../models/StationaryOrder");
const Booking = require("../models/Booking");
const User = require("../models/User");
const FoodItem = require("../models/FoodItem");
const StationaryItem = require("../models/Stationary");
const MovieTicket = require("../models/Movie");
const BeautySalon = require("../models/BeautySalon");
const Fitness = require("../models/Fitness");
const PartyHall = require("../models/PartyHall");

//Voyager Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Account already exists" });
    }
    const newAdmin = new User({
      name,
      email: email.toLowerCase(),
      password, // Auto-hashed by the User model
      role: "VOYAGER",
    });
    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Signup successful",
      adminId: newAdmin._id,
    });
  } catch (err) {
    console.error("Error in signup:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});
// Voyager Sign In
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email, role: "VOYAGER" });
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Given email is not valid",
      });
    }

    if (!(await userData.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Password is not valid",
      });
    }

    const payload = {
      id: userData.id,
      role: "VOYAGER",
    };
    const token = generateToken(payload);
    const name = userData.name;
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      name,
    });
  } catch (err) {
    console.log("An error occured while admin login =", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/my-catering", jwtAuthMiddleware, async (req, res) => {
  try {
    const orders = await CateringOrder.find({
      voyagerId: req.user.id,
      "items.status": "AddItem",
    });

    if (!orders || orders.length === 0) {
      return res.json({ items: [] });
    }

    const allItems = orders.flatMap((order) =>
      order.items
        .filter((item) => item.status === "AddItem")
        .map((item) => ({
          ...item.toObject(),
          orderId: order._id,
        }))
    );
    console.log("Catering items sent:", allItems);
    res.json({ items: allItems });
  } catch (error) {
    console.error("Error fetching catering items:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH: Update quantity of a catering cart item

router.patch("/update-catering-quantity",  jwtAuthMiddleware,  async (req, res) => {
    try {
      const { orderId, itemId, quantity } = req.body;

      if (!orderId || !itemId || quantity < 1) {
        return res.status(400).json({ error: "Invalid data" });
      }

      const order = await CateringOrder.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const item = order.items.id(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      item.quantity = quantity;
      // Optionally update item.price = item.unitPrice * quantity; if using unitPrice

      await order.save();

      res.json({ message: "Quantity updated", item });
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// PUT: /update-status-catering
router.put("/update-status-catering", jwtAuthMiddleware, async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;

    const order = await CateringOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update status of all items
    order.items = order.items.map((item) => ({
      ...item.toObject(),
      status: newStatus,
    }));

    await order.save();
    await CateringOrder.updateOne(
      { _id: orderId, status: "AddItem" },
      { $set: { "status.$": "Ordered" } }
    );
    // console.log("Status updated successfully.");

    res.json({ message: "All items status updated", order });
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get the active order with status "AddItem"
router.get("/get-catering-order", jwtAuthMiddleware, async (req, res) => {
  try {
    const order = await CateringOrder.findOne({
      voyagerId: req.user.id,
      status: { $in: ["AddItem"] },
    });

    res.json({ order: order || null });
  } catch (err) {
    console.error("GET ORDER ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/order-catering", jwtAuthMiddleware, async (req, res) => {
  try {
    const { items, orderId } = req.body;
    const voyagerId = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided." });
    }

    // Validate all items
    const validItems = await Promise.all(
      items.map(async (item) => {
        const itemId = item.id;
        const food = await FoodItem.findById(itemId);
        if (!food) throw new Error(`Item not found: ${itemId}`);
        return {
          _id: itemId,
          name: food.name,
          price: food.price,
          image: food.image,
          quantity: item.quantity || 1,
          status: "AddItem",
        };
      })
    );

    let order;
    if (orderId) {
      // Update existing order
      order = await CateringOrder.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      // Merge items: if exists, increment; else add
      validItems.forEach((newItem) => {
        const index = order.items.findIndex(
          (existingItem) =>
            existingItem._id.toString() === newItem._id.toString()
        );
        if (index > -1) {
          order.items[index].quantity = newItem.quantity;
        } else {
          order.items.push(newItem);
        }
      });

      await order.save();
    } else {
      // Create new order
      order = new CateringOrder({
        voyagerId,
        items: validItems,
        status: ["AddItem"],
      });
      await order.save();
    }

    res.json({ message: "Added to cart!" });
  } catch (err) {
    console.error("ORDER CATERING ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get("/get-ordered-orders", jwtAuthMiddleware, async (req, res) => {
  try {
    const orderedOrders = await CateringOrder.find({
      voyagerId: req.user.id,
      status: "Ordered",
    });

    res.json({ orders: orderedOrders });
  } catch (err) {
    console.error("Error fetching ordered orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/get-accepted-orders", jwtAuthMiddleware, async (req, res) => {
  try {
    const acceptedOrders = await CateringOrder.find({
      voyagerId: req.user.id,
      status: "Accepted",
    });

    res.json({ orders: acceptedOrders });
  } catch (err) {
    console.error("Error fetching accepted orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});




//Stationary

router.get("/get-stationary-order", jwtAuthMiddleware, async (req, res) => {
  try {
    const order = await StationaryOrder.findOne({
      voyagerId: req.user.id,
      status: { $in: ["AddItem"] },
    });

    res.json({ order: order || null });
  } catch (err) {
    console.error("GET ORDER ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/order-stationary", jwtAuthMiddleware, async (req, res) => {
  try {
    const { items, orderId } = req.body;
    const voyagerId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid items" });
    }

    const validItems = await Promise.all(
      items.map(async (item) => {
        const itemId = item.id;
        const stationary = await StationaryItem.findById(itemId);
        if (!stationary || stationary.quantity < item.quantity) {
          return res
            .status(400)
            .json({
              message:
                "Sorry, we have limited quantity available for this item",
            });
        }
        return {
          _id: itemId,
          name: stationary.name,
          price: stationary.price,
          image: stationary.image,
          quantity: item.quantity || 1,
          status: "AddItem",
        };
      })
    );

    let order;
    if (orderId) {
      // Update existing order
      order = await StationaryOrder.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      // Merge items: if exists, increment; else add
      validItems.forEach((newItem) => {
        const index = order.items.findIndex(
          (existingItem) =>
            existingItem._id.toString() === newItem._id.toString()
        );
        if (index > -1) {
          order.items[index].quantity = newItem.quantity;
        } else {
          order.items.push(newItem);
        }
      });

      await order.save();
    } else {
      // Create new order
      order = new StationaryOrder({
        voyagerId,
        items: validItems,
        status: ["AddItem"],
      });
      await order.save();
    }

    res.json({ message: "Added to cart!" });

    
  } catch (err) {
    console.error("Stationary Order Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});








router.get("/my-stationary", jwtAuthMiddleware, async (req, res) => {
  try {
    const orders = await StationaryOrder.find({
      voyagerId: req.user.id,
      "items.status": "AddItem",
    });

    if (!orders || orders.length === 0) {
      return res.json({ items: [] }); 
    }

    const allItems = orders.flatMap((order) =>
      order.items.filter((item) => item.status === "AddItem")
    );
    console.log("Stationary items sent:", allItems);
    res.json({ items: allItems });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to delete an item from the catering order
router.delete("/delete-item-catering", jwtAuthMiddleware, async (req, res) => {
  try {
    const { orderId, itemId } = req.body; // Order ID and Item ID

    // Find the order by orderId
    const order = await CateringOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the index of the item to delete
    const itemIndex = order.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in this order" });
    }

    // Remove the item from the items array
    order.items.splice(itemIndex, 1);

    // Save the updated order
    await order.save();

    res.json({ message: "Item deleted successfully", order });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/book", jsonwebtoken, async (req, res) => {
  const booking = new Booking({ voyagerId: req.user.id, ...req.body });
  await booking.save();
  res.json({ message: "Booking successful" });
});




const generateCRUDRoutes = (path, Model) => {
  router.get(`/get-${path}`, async (req, res) => {
    try {
      const items = await Model.find();
      res.json(items);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });
};
generateCRUDRoutes("food-item", FoodItem);
generateCRUDRoutes("stationary-item", StationaryItem);


// Update stationary quantity

module.exports = router;
