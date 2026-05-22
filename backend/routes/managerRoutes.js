const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Booking = require("../models/Booking");
const jsonwebtoken = require("../middleware/auth")("MANAGER");
const { generateToken, jwtAuthMiddleware } = require("../middleware/jwt");
const PartyHall = require("../models/PartyHall");
const Moviehall = require("../models/Moviehall");
const User = require("../models/user")
const Notification = require("../models/Notification");

router.get("/dashboard", jwtAuthMiddleware, async (req, res) => {
  try {
    const personalId = new mongoose.Types.ObjectId(req.user.id);

    const counts = await Booking.aggregate([
      {
        $match: {
          managerId: personalId,
          status: "Accepted",
        },
      },
      {
        $group: {
          _id: { $toLower: "$type" },
          count: { $sum: 1 },
        },
      },
    ]);

    const dashboardData = {
      nsalonBooking: 0,
      npartyhallBooking: 0,
      nfitnessBooking: 0,
    };

    counts.forEach(({ _id, count }) => {
      if (_id === "salon") dashboardData.nsalonBooking = count;
      else if (_id === "party hall") dashboardData.npartyhallBooking = count;
      else if (_id === "fitness") dashboardData.nfitnessBooking = count;
    });

    res.status(200).json({
      success: true,
      ...dashboardData,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/showname_navbar", jwtAuthMiddleware, async (req, res) => {
  try {
    const manager = await User.findById(req.user.id).select(
      "name email role profilePic"
    );
    if (!manager) {
      return res.status(404).json({ message: "manager not found" });
    }

    res.status(200).json({ success: true, manager });
  } catch (err) {
    console.error("Error fetching manager profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// View Party Hall Bookings
router.get("/get-booked-partyhall", jwtAuthMiddleware, async (req, res) => {
  try {
    const managerId = req.user.id;

    const allBookingsRaw = await Booking.find({
      type: "Party Hall",
      status: "Booking",
    })
      .populate("voyagerId", "name email")
      .sort({ createdAt: -1 });

    const acceptedBookingsRaw = await Booking.find({
      type: "Party Hall",
      status: "Accepted",
      managerId: managerId,
    })
      .populate("voyagerId", "name email")
      .sort({ createdAt: -1 });

    const enrichWithHallName = async (bookings) =>
      await Promise.all(
        bookings.map(async (booking) => {
          const hallId = booking.details?.hallId;
          const hall = hallId ? await PartyHall.findById(hallId) : null;
          return {
            ...booking.toObject(),
            hallName: hall ? hall.hallName : "Hall not found",
          };
        })
      );

    const allBookings = await enrichWithHallName(allBookingsRaw);
    const acceptedBookings = await enrichWithHallName(acceptedBookingsRaw);

    res.json({
      bookings: allBookings,
      accepted: acceptedBookings,
    });
  } catch (error) {
    console.error("Error fetching booked party halls:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/accept-partyhall-order/:id", jwtAuthMiddleware, async (req, res) => {
    try {
      const managerId = req.user.id;
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        {
          status: "Accepted",
          managerId: managerId,
        },
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await Notification.create({
        userId: booking.voyagerId,
        type: "Party Hall",
        message: "Your party hall booking has been accepted by the manager!",
        bookingId: booking._id,
        isRead: false,
      });

      res.json(booking);
    } catch (error) {
      console.error("Error accepting order:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// View Fitness Service Bookings

router.get("/get-booked-fitness", jwtAuthMiddleware, async (req, res) => {
  try {
    const managerId = req.user.id;

    // Get all salon bookings
    const allBookings = await Booking.find({
      type: "Fitness",
      status: "Booking",
    })
      .populate("voyagerId", "name email")
      .sort({ createdAt: -1 });

    // Get accepted bookings specific to this manager
    const acceptedBookings = await Booking.find({
      type: "Fitness",
      status: "Accepted",
      managerId: managerId,
    })
      .populate("voyagerId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      bookings: allBookings,
      accepted: acceptedBookings,
    });
  } catch (error) {
    console.error("Error fetching booked salons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/accept-fitness-order/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const managerId = req.user.id;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "Accepted",
        managerId: managerId,
      },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await Notification.create({
      userId: booking.voyagerId,
      type: "Fitness",
      message: "Your fitness booking has been accepted by the manager!",
      bookingId: booking._id,
      isRead: false,
    });

    res.json(booking);
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//View Movies Bookings
router.get("/get-booked-movies", jwtAuthMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ type: "Movie" })
      .populate("voyagerId", "name email")
      .sort({ createdAt: -1 });

      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
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

    res.json(enrichedBookings);
  } catch (error) {
    console.error("Error fetching booked party halls:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-booked-salon", jwtAuthMiddleware, async (req, res) => {
  try {
    const managerId = req.user.id;

    // Get all salon bookings
    const allBookings = await Booking.find({
      type: "Salon",
      status: "Booking",
    })
      .populate("voyagerId", "name email")
      .sort({ createdAt: -1 });

    // Get accepted bookings specific to this manager
    const acceptedBookings = await Booking.find({
      type: "Salon",
      status: "Accepted",
      managerId: managerId,
    })
      .populate("voyagerId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      bookings: allBookings,
      accepted: acceptedBookings,
    });
  } catch (error) {
    console.error("Error fetching booked salons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/accept-salon-order/:id", jwtAuthMiddleware, async (req, res) => {
    try {
      const managerId = req.user.id;
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        {
          status: "Accepted",
          managerId: managerId,
        },
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await Notification.create({
        userId: booking.voyagerId,
        type: "Salon",
        message: "Your Salon booking has been accepted by the manager!",
        bookingId: booking._id,
        isRead: false,
      });

      res.json(booking);
    } catch (error) {
      console.error("Error accepting order:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(`/get-single-manager/:id`, jwtAuthMiddleware, async (req, res) => {
  try {
    const item = await User.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error("GET single error:", error);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

router.put("/update-manager/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Item not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.password) user.password = req.body.password; 

    // console.log(user.password);
    await user.save(); 

    res.json(user);
  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
});


module.exports = router;
