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
const Moviehall = require("../models/Moviehall");
const PartyHall = require("../models/PartyHall");
const Fitness = require("../models/Fitness");
const BeautySalon = require("../models/BeautySalon");
const MovieBooking = require("../models/MovieBooking");
const SlotUsageSalon = require("../models/SlotUsageSalon");
const Gallery = require("../models/Gallery");
const Contact = require("../models/Contact");
const Notification = require("../models/Notification");

const serviceModels = {
  salon: BeautySalon,
  fitness: Fitness,
};

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

router.get("/notifications", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/notifications/mark-read", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Server error" });
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
    res.json({ items: allItems });
  } catch (error) {
    console.error("Error fetching catering items:", error);
    res.status(500).json({ error: "Server error" });
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

router.patch("/update-catering-quantity", jwtAuthMiddleware, async (req, res) => {
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
});

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

    res.json({ message: "All items status updated", order });
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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

router.get("/get-ordered-catering", jwtAuthMiddleware, async (req, res) => {
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

router.get("/get-accepted-catering", jwtAuthMiddleware, async (req, res) => {
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
      order.items
        .filter((item) => item.status === "AddItem")
        .map((item) => ({
          ...item.toObject(),
          orderId: order._id,
        }))
    );
    res.json({ items: allItems });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

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
          return res.status(400).json({
            message: "Sorry, we have limited quantity available for this item",
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

router.patch("/update-quantity-stationary", async (req, res) => {
    try {
      const { orderId, itemId, quantity } = req.body;

      if (!orderId || !itemId || quantity < 1) {
        return res.status(400).json({ error: "Invalid data" });
      }

      const order = await StationaryOrder.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const item = order.items.id(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      item.quantity = quantity;
      await order.save()

      res.json({ message: "Quantity updated", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete stationary item
router.delete("/delete-stationary-items", async (req, res) => {
  try {
    const { orderId, itemId } = req.body; // Order ID and Item ID

    // Find the order by orderId
    const order = await StationaryOrder.findById(orderId);

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

router.put("/update-stationary-status", jwtAuthMiddleware, async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;

    const order = await StationaryOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update status of all items
    order.items = order.items.map((item) => ({
      ...item.toObject(),
      status: newStatus,
    }));

    await order.save();
    await StationaryOrder.updateOne(
      { _id: orderId, status: "AddItem" },
      { $set: { "status.$": "Ordered" } }
    );

    res.json({ message: "All items status updated", order });
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-ordered-stationary", jwtAuthMiddleware, async (req, res) => {
  try {
    const orderedOrders = await StationaryOrder.find({
      voyagerId: req.user.id,
      status: "Ordered",
    });

    res.json({ orders: orderedOrders });
  } catch (err) {
    console.error("Error fetching ordered orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/get-accepted-stationary", jwtAuthMiddleware, async (req, res) => {
  try {
    const acceptedOrders = await StationaryOrder.find({
      voyagerId: req.user.id,
      status: "Accepted",
    });

    res.json({ orders: acceptedOrders });
  } catch (err) {
    console.error("Error fetching accepted orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// router.get("/get-cartnotification-count", jwtAuthMiddleware, async(req,res) => {
//   try {
//     const stationaryOrders = await StationaryOrder.find({
//       voyagerId: req.user.id,
//       "items.status": "AddItem",
//     });

//     const cateringOrders = await CateringOrder.find({
//       voyagerId: req.user.id,
//       "items.status": "AddItem",
//     });
    
//     let stationaryCount = 0;
//     let cateringCount = 0;

//     // Sum stationary quantities
//     stationaryOrders.forEach((order) => {
//       order.items.forEach((item) => {
//         if (item.status === "AddItem") {
//           stationaryCount += item.quantity;
//         }
//       });
//     });

//     // Sum catering quantities
//     cateringOrders.forEach((order) => {
//       order.items.forEach((item) => {
//         if (item.status === "AddItem") {
//           cateringCount += item.quantity;
//         }
//       });
//     });

//     const totalCount = stationaryCount + cateringCount;

//     res.json({
//       stationaryCount,
//       cateringCount,
//       totalCount,
//     });

//   } catch (error) {
//     console.error("Error fetching notification counts:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// })

const getModelByPath = (path) => {
  return serviceModels[path] || null;
};

//Get salon and fitness service using category
router.get(`/get-categorized-:path`, async (req, res) => {
  try {
    const { path } = req.params;
    const { category } = req.query;
    const Model = getModelByPath(path);

    if (!Model) {
      return res.status(400).json({ error: "Invalid service path." });
    }

    const query = {};
    // const query = { isActive: true };

    if (category) query.category = category;
    query.isActive = true;

    const items = await Model.find(query);
    res.json(items);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

//Booking Party hall
router.post("/bookings-partyhall", jwtAuthMiddleware, async (req, res) => {
  const {
    userId,
    name,
    email,
    requirements,
    hallId,
    // status,
    startTime,
    endTime,
    bookingdate,
    price,
  } = req.body;

  try {
    const newBooking = new Booking({
      voyagerId: userId,
      type: "Party Hall",
      status: "Booking",
      details: {
        name,
        email,
        hallId,
        requirements,
        startTime,
        endTime,
        bookingdate,
        price,
      },
    });
    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to book" });
  }
});

router.post("/bookings-fitnessservice", jwtAuthMiddleware, async (req, res) => {
  const {
    userId,
    name,
    email,
    requirements,
    serviceId,
    // status,
    bookingTime,
    bookingdate,
    selectedEquipments,
  } = req.body;

  try {
    const newBooking = new Booking({
      voyagerId: userId,
      type: "Fitness",
      status: "Booking",
      details: {
        name,
        email,
        serviceId,
        requirements,

        bookingTime,
        bookingdate,
        selectedEquipments,
      },
    });
    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to book" });
  }
});

//get user details by id
router.get("/get-user-details/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email").lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const generateCRUDRoutes = (path, Model) => {
  router.get(`/get-${path}`, async (req, res) => {
    try {
      const items = await Model.find({ isActive: true }).sort({
        createdAt: -1,
      });
      res.json(items);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });
  router.get(`/get-single-${path}/:id`, jwtAuthMiddleware, async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: "Item not found" });
      res.json(item);
    } catch (error) {
      console.error("GET single error:", error);
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });
};

generateCRUDRoutes("food-item", FoodItem);
generateCRUDRoutes("stationary-item", StationaryItem);
generateCRUDRoutes("partyHall", PartyHall);
generateCRUDRoutes("fitness", Fitness);
generateCRUDRoutes("salon", BeautySalon);
generateCRUDRoutes("movie", Moviehall);

// Get booked seats for a movie for a given date and timeslot
router.get(
  "/get-booked-seats/:movieId",
  jwtAuthMiddleware,
  async (req, res) => {
    const { date, timeSlotId } = req.query;
    const { movieId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }

      // Validate movie exists
      const movie = await Moviehall.findById(movieId);
      if (!movie) return res.status(404).json({ error: "Movie not found" });

      // Find booking for given date and timeSlotId
      const bookingEntry = await MovieBooking.findOne({
        movieId,
        date,
        timeSlotId,
      });

      res.json({ bookedSeats: bookingEntry ? bookingEntry.seatsBooked : [] });
    } catch (error) {
      console.error("GET booked seats error:", error);
      res.status(500).json({ error: "Failed to fetch booked seats" });
    }
  }
);

// POST route to book seats + food items
router.post("/book-movie", jwtAuthMiddleware, async (req, res) => {
  const { movieId, date, timeSlotId, seats, userId, foodItems, totalPrice } =
    req.body;
  try {
    // Validate movie
    const movie = await Moviehall.findById(movieId);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    // Check or create booking entry for seat conflict check
    let bookingEntry = await MovieBooking.findOne({
      movieId,
      date,
      timeSlotId,
      totalPrice,
    });

    if (bookingEntry) {
      const conflict = seats.some((s) => bookingEntry.seatsBooked.includes(s));
      if (conflict)
        return res.status(409).json({ error: "Some seats already booked." });
      bookingEntry.seatsBooked.push(...seats);
    } else {
      bookingEntry = new MovieBooking({
        movieId,
        date,
        timeSlotId,
        seatsBooked: seats,
        totalPrice,
      });
    }
    // console.log("bookingEntry:", bookingEntry);

    await bookingEntry.save();

    // Save booking to main Booking schema
    const voyagerId = userId;

    if (!voyagerId) {
      return res.status(401).json({ error: "Unauthorized: missing user ID" });
    }
    const booking = new Booking({
      voyagerId,
      type: "Movie",
      status: "Accepted",
      details: {
        movieId,
        movieId: movieId,
        date,
        timeSlotId,
        seats,
        foodItems,
        totalPrice,
      },
    });
    // console.log("booking", booking);
    await booking.save();

    res.json({ message: "Booking successful" });
  } catch (error) {
    console.error("POST booking error:", error);
    res.status(500).json({ error: "Failed to book seats" });
  }
});

//get booking Fitness

router.get("/get-fitness-bookings", jwtAuthMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      voyagerId: req.user.id,
      status: { $in: ["Booking", "Accepted"] },
      type: "Fitness",
    }).sort({ createdAt: -1 });

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.details?.serviceId) {
          const service = await Fitness.findById(booking.details.serviceId);
          return {
            ...booking.toObject(),
            ServiceName: service ? service.servicename : "Service not found",
          };
        }
        return {
          ...booking.toObject(),
          hallName: "Service not assigned",
        };
      })
    );

    res.json({ orders: enrichedBookings });
  } catch (err) {
    console.error("Error fetching party hall bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Movie Hall
router.get("/get-booked-movie", jwtAuthMiddleware, async (req, res) => {
  try {
    const orderedOrders = await Booking.find({
      voyagerId: req.user.id,
      status: "Accepted",
      type: "Movie",
    }).sort({ createdAt: -1 });

    const enrichedBookings = await Promise.all(
      orderedOrders.map(async (booking) => {
        if (booking.details?.movieId) {
          const movie = await Moviehall.findById(booking.details.movieId);
          return {
            ...booking.toObject(),
            MovieName: movie ? movie.title : "Movie not found",
          };
        }

        return {
          ...booking.toObject(),
          MovieName: "Movie ID not provided",
        };
      })
    );
    res.json({ orders: enrichedBookings });
  } catch (err) {
    console.error("Error fetching ordered orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Combine both queries (Ordered and Accepted) into one route
router.get("/get-partyhall-bookings", jwtAuthMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      voyagerId: req.user.id,
      status: { $in: ["Booking", "Accepted"] },
      type: "Party Hall",
    }).sort({ createdAt: -1 });

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.details?.hallId) {
          const hall = await PartyHall.findById(booking.details.hallId);
          return {
            ...booking.toObject(),
            hallName: hall ? hall.hallName : "Hall not found",
          };
        }
        return {
          ...booking.toObject(),
          hallName: "Hall not assigned",
        };
      })
    );

    res.json({ orders: enrichedBookings });
  } catch (err) {
    console.error("Error fetching party hall bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});



//Salon
router.get("/get-booking-salon", jwtAuthMiddleware, async (req, res) => {
  try {
    const orderedOrders = await Booking.find({
      voyagerId: req.user.id,
      status: "Ordered",
      type: "Salon",
    }).sort({ createdAt: -1 });;
    res.json({ orders: orderedOrders });
  } catch (err) {
    console.error("Error fetching ordered orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/get-accepted-salon", jwtAuthMiddleware, async (req, res) => {
  try {
    const acceptedOrders = await Booking.find({
      voyagerId: req.user.id,
      status: "Accepted",
      type: "Salon",
    }).sort({ createdAt: -1 });;

    res.json({ orders: acceptedOrders });
  } catch (err) {
    console.error("Error fetching accepted orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//booking salon
router.post("/bookings-salon", async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      requirements,
      status,
      salonId,
      bookingTime, 
      bookingdate,
      price,
    } = req.body;

    // 1. Fetch the salon and check if slot exists
    const salon = await BeautySalon.findById(salonId);
    if (!salon) return res.status(404).json({ error: "Salon not found" });

    const selectedSlot = salon.service.find(
      (s) => s.serviceslot === bookingTime
    );
    if (!selectedSlot) {
      return res
        .status(400)
        .json({ error: "Selected slot not available in salon" });
    }

    const maxCount = parseInt(selectedSlot.serviceprovidecount, 10);

    // 2. Check SlotUsageSalon for used count
    let usage = await SlotUsageSalon.findOne({
      salonId,
      serviceslot: bookingTime,
      bookingdate,
    });

    if (usage && usage.usedCount >= maxCount) {
      return res.status(400).json({ error: "This time slot is fully booked." });
    }

    // 3. Update usage count
    if (!usage) {
      usage = new SlotUsageSalon({
        salonId,
        serviceslot: bookingTime,
        bookingdate,
        usedCount: 1,
      });
    } else {
      usage.usedCount += 1;
    }
    await usage.save();

    // 4. Save booking
    const booking = new Booking({
      voyagerId: userId,
      status:"Booking",
      type: "Salon",
      details: {
        salonId,
        salonName: salon.serviceName,
        name,
        email,
        bookingTime,
        bookingdate,
        requirements,
        price,
      },
    });

    await booking.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Salon booking error:", error);
    res.status(500).json({ error: "Server error while booking salon" });
  }
});

router.get("/get-salon-bookings", jwtAuthMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      voyagerId: req.user.id,
      status: { $in: ["Booking", "Accepted"] },
      type: "Salon",
    }).sort({ createdAt: -1 });

    
    res.json({ orders: bookings });
  } catch (err) {
    console.error("Error fetching salon bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//about second section
router.get("/team/:role", async (req, res) => {
  try {
    const roleParam = req.params.role.trim();
    const regex = new RegExp(`^${roleParam}$`, "i");

    const teamMembers = await User.find({ role: regex })
      .sort({ createdAt: -1 }) 
      .limit(4);

    res.status(200).json({
      success: true,
      team: teamMembers,
    });
  } catch (error) {
    console.error("Team fetch error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//Gallery
router.get("/get-gallery", async (req, res) => {
  try {
    const getgallery = await Gallery.find({ isActive: true }); 
    res.json(getgallery);
  } catch (err) {
    console.error("Error fetching gallery:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Person want to contact
router.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully to us. We will contact you soon" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports = router;
