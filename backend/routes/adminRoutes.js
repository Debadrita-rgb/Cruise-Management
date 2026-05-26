const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jsonwebtoken = require("../middleware/auth")("ADMIN");
const { generateToken, jwtAuthMiddleware } = require("../middleware/jwt");

// Import your models (adjust paths as needed)
const User = require("../models/user");
const FoodItem = require("../models/FoodItem");
const Category = require("../models/Category");
const Stationary = require("../models/Stationary");
const Moviehall = require("../models/Moviehall");
const BeautySalon = require("../models/BeautySalon");
const Fitness = require("../models/Fitness");
const PartyHall = require("../models/PartyHall");
const Gallery = require("../models/Gallery");
const Contact = require("../models/Contact");
const Testimonial = require("../models/Testimonial");

// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     let existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Account already exists" });
//     }
//     const newAdmin = new User({
//       name,
//       email: email.toLowerCase(),
//       password, // Auto-hashed by the User model
//       role: "ADMIN",
//     });
//     await newAdmin.save();

//     res.status(201).json({
//       success: true,
//       message: "Signup successful",
//       adminId: newAdmin._id,
//     });
//   } catch (err) {
//     console.error("Error in signup:", err);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: err.message });
//   }
// });
//  "success": true,
//     "message": "Signup successful",
//     "adminId": "681a5d674de33640dbf04bf4"

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });
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
      role: "ADMIN",
    };
    const token = generateToken(payload);
    console.log("Token has been generated =", token);
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
    });
  } catch (err) {
    console.log("An error occured while admin login =", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/dashboardData", jwtAuthMiddleware, async (req, res) => {
  try {
    const nUser = await User.countDocuments();
    const partyHallCount = await PartyHall.countDocuments();
    const fitnessCount = await Fitness.countDocuments();
    const movieCount = await Moviehall.countDocuments();
    const beautySalonCount = await BeautySalon.countDocuments();

    const cateringCount = await FoodItem.countDocuments();
    const stationaryCount = await Stationary.countDocuments();

    const totalService =
      partyHallCount + fitnessCount + movieCount + beautySalonCount;
    const totalFacility = cateringCount + stationaryCount;
// console.log("User", nUser);
// console.log("totalSer", totalService);
// console.log("fac", totalFacility);
    res.status(200).json({
      success: true,
      nUser,
      totalService,
      totalFacility,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get(`/get-saloncategory-active`, async (req, res) => {
  try {
    const items = await Category.find({ isActive: true, type: "Salon" });
    res.json(items);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.get(`/get-moviecategory-active`, jwtAuthMiddleware, async (req, res) => {
  try {
    const items = await Category.find({ isActive: true, type: "Movie" });
    res.json(items);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.get(`/get-fitnesscategory-active`, async (req, res) => {
    try {
      const items = await Category.find({ isActive: true, type: "Fitness" });
      res.json(items);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  }
);

// Generic CRUD Route Generator
const generateCRUDRoutes = (path, Model) => {
  //GET all items
  router.get(`/get-${path}`, jwtAuthMiddleware, async (req, res) => {
    try {
      const items = await Model.find().sort({createdAt: -1});
      res.json(items);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  // GET single item by ID
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

  // Add
  router.post(`/add-${path}`, jwtAuthMiddleware, async (req, res) => {
    try {
      const item = new Model(req.body);
      await item.save();
      res.json({ message: `${path} added`, item });
    } catch (error) {
      console.error("Server Error:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  });

  // PUT update item by ID
  router.put(`/update-${path}/:id`, jwtAuthMiddleware, async (req, res) => {
    try {
      const updatedItem = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedItem)
        return res.status(404).json({ error: "Item not found" });
      res.json(updatedItem);
    } catch (error) {
      console.error("PUT error:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  // DELETE item by ID
  router.delete(`/delete-${path}/:id`, jwtAuthMiddleware, async (req, res) => {
    try {
      const deletedItem = await Model.findByIdAndDelete(req.params.id);
      if (!deletedItem)
        return res.status(404).json({ error: "Item not found" });
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("DELETE error:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  // Toggle isActive
  router.patch(
    `/toggle-${path}-status/:id`,
    jwtAuthMiddleware,
    async (req, res) => {
      const { isActive } = req.body;
      try {
        const updated = await Model.findByIdAndUpdate(
          req.params.id,
          { isActive },
          { new: true }
        );
        res.json({ message: `${path} status updated`, updated });
      } catch (err) {
        console.error("Toggle Error:", err);
        res.status(500).json({ message: `Failed to toggle ${path} status` });
      }
    }
  );

  //Get Salon categorized Service
  router.get(`/get-categorized-${path}`, jwtAuthMiddleware, async (req, res) => {
      try {
        const { category } = req.query;
        let query = {};

        if (category) {
          query.category = category;
        }

        const items = await Model.find(query);
        res.json(items);
      } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Failed to fetch items" });
      }
    }
  );

  // route to get all managers, head cooks, and supervisors
  router.get("/get-staff-users", jwtAuthMiddleware, async (req, res) => {
    try {
      const staffUsers = await User.find({
        role: { $in: ["MANAGER", "HEADCOOK", "SUPERVISOR"] },
      });
      res.json(staffUsers);
    } catch (error) {
      console.error("Error fetching staff users:", error);
      res.status(500).json({ error: "Failed to fetch staff users" });
    }
  });
  //add user
  router.post(`/add-user`, jwtAuthMiddleware, async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Add user failed:", error);
      res.status(400).json({ error: error.message });
    }
  });
  
};

// Generate routes for all admin sections
generateCRUDRoutes("food-item", FoodItem);
generateCRUDRoutes("stationary-item", Stationary);
generateCRUDRoutes("moviehall", Moviehall);
generateCRUDRoutes("beauty-salon", BeautySalon);
generateCRUDRoutes("fitness", Fitness);
generateCRUDRoutes("partyhall", PartyHall);
generateCRUDRoutes("user", User);
generateCRUDRoutes("gallery", Gallery);
generateCRUDRoutes("contact", Contact);
generateCRUDRoutes("category", Category);
generateCRUDRoutes("testimonial", Testimonial);

router.get(`/get-fullcontact-details`, jwtAuthMiddleware, async (req, res) => {
  try {
    const items = await Contact.find({status: "Contact"}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.get(`/get-fullfeedback-details`, jwtAuthMiddleware, async (req, res) => {
  try {
    const items = await Contact.find({ status: "Feedback" }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

module.exports = router;
