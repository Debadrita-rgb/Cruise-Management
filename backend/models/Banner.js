const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  page_type: {
    type: String,
    enum: [
      "catering",
      "stationary",
      "salonCategory",
      "partyhall",
      "fitnessCategory",
      "movies",
      "testimonial",
      "contact",
      "feedback",
      "faq",
      "about",
    ],
    required: true,
  },
  page_banner_image: { type: String, required: true },
  heading: { type: String, required: true },
  paragraph: { type: String, required: true },
  isActive: { type: Boolean, default: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banner", BannerSchema);
