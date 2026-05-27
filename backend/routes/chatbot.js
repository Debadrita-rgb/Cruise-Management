const express = require("express");
const router = express.Router();
const model = require("../config/gemini");
const FoodItem = require("../models/FoodItem");
const Stationary = require("../models/Stationary");
const Moviehall = require("../models/Moviehall");
const BeautySalon = require("../models/BeautySalon");
const Fitness = require("../models/Fitness");
const PartyHall = require("../models/PartyHall");

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const stopWords = [
      "what",
      "is",
      "the",
      "price",
      "of",
      "show",
      "me",
      "tell",
      "about",
      "please",
      "time",
      "slot",
    ];

    const words = message
      .toLowerCase()
      .split(" ")
      .filter((word) => !stopWords.includes(word));

    const searchText = words.join(" ");
    const lowerMessage = message.toLowerCase();

    //  MOVIES
    if (lowerMessage.includes("movie page")) {
      return res.json({
        reply: "Opening Movie Page...",
        route: "/services/facilities/movies",
      });
    }
    const movie = await Moviehall.findOne({
      title: {
        $regex: searchText,
        $options: "i",
      },
    });

    if (movie) {
      return res.json({
        reply: `
        🎬 Movie: ${movie.title}

        🎟 Price: ₹${movie.moviePrice}

        🕒 Show Time: ${movie.showtimeslot.join(", ")}

        🍿 Hall Type: ${movie.halltype}

        🗣 Language: ${movie.language}
        `,
      });
    }

    //  FITNESS
    if (
      lowerMessage.includes("fitness page") ||
      lowerMessage.includes("gym page") ||
      lowerMessage.includes("yoga page")
    ) {
      return res.json({
        reply: "Opening Fitness Section Page...",
        route: "/services/facilities/fitnessCategory",
      });
    }
    const fitness = await Fitness.findOne({
      servicename: { $regex: searchText, $options: "i" },
    });

    if (fitness) {
      return res.json({
        reply: `
        💪 Fitness Service: ${fitness.servicename}

        💰 Price: ₹${fitness.price}

        🕒 Slots: ${fitness.serviceslot.join(", ")}

        ${fitness.trainer ? `🏋 Trainer: ${fitness.trainer}` : ""}
        `,
      });
    }

    //  SALON
    if (
      lowerMessage.includes("salon page") ||
      lowerMessage.includes("beauty salon page") ||
      lowerMessage.includes("beauty page")
    ) {
      return res.json({
        reply: "Opening Beauty Salon Page...",
        route: "/services/facilities/salonCategory",
      });
    }
    const salon = await BeautySalon.findOne({
      serviceName: { $regex: searchText, $options: "i" },
    });

    if (salon) {
      return res.json({
        reply: `
      💇 Salon Service: ${salon.serviceName}

      💰 Price: ₹${salon.price}

      🕒 Timing: ${salon.serviceslot}

      ⏱ Duration: ${salon.servicetime}
        `,
      });
    }

    //  PARTY HALL
    if (
      lowerMessage.includes("party hall page") ||
      lowerMessage.includes("hall page") ||
      lowerMessage.includes("party page")
    ) {
      return res.json({
        reply: "Opening Party hall Page...",
        route: "/services/facilities/partyhall",
      });
    }
    const hall = await PartyHall.findOne({
      hallName: { $regex: searchText, $options: "i" },
    });

    if (hall) {
      return res.json({
        reply: `
          🏛 Hall: ${hall.hallName}

          👥 Capacity: ${hall.capacity}

          💰 Price: ₹${hall.price}
        `,
      });
    }

    //  STATIONARY
    if (lowerMessage.includes("stationary page")) {
      return res.json({
        reply: "Opening Stationary Page...",
        route: "/services/stationary",
      });
    }
    const stationary = await Stationary.findOne({
      name: { $regex: searchText, $options: "i" },
    });

    if (stationary) {
      return res.json({
        reply: `
        🖊 Product: ${stationary.name}

        💰 Price: ₹${stationary.price}

        📦 Quantity Available: ${stationary.quantity}
        `,
      });
    }

    //  FOOD
    if (
      lowerMessage.includes("catering page") ||
      lowerMessage.includes("food page")
    ) {
      return res.json({
        reply: "Opening Catering Page...",
        route: "/services/catering",
      });
    }
    const food = await FoodItem.findOne({
      name: { $regex: searchText, $options: "i" },
    });

    if (food) {
      return res.json({
        reply: `
          🍽 Food Item: ${food.name}

          💰 Price: ₹${food.price}
        `,
      });
    }

    //NO DATA FOUND
    if (!movie && !fitness && !salon && !hall && !stationary && !food) {
      return res.json({
        reply:
          "Sorry, I could not find that movie, salon service, food item, or product.",
      });
    }

    //  GEMINI FALLBACK

    const prompt = `
      You are an AI assistant for Cruise Management System.

      Answer politely and professionally.

      User Question:
      ${message}
      `;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    res.json({
      reply: text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Internal server error",
      // reply: "Sorry, I could not find that movie or service or food items or stationary.",
    });
  }
});

module.exports = router;
