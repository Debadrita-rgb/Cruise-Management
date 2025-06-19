const mongoose = require("mongoose");

const MoviehallSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  showtimeslot: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "At least one service slot is required",
    },
  },
  totalSeats: { type: Number, required: true },
  movieimage: { type: String },
  halltype: { type: String },
  language: { type: String },
  totalTiming: { type: String },
  // posterUrl: { type: String },
  releasedDate: { type: Date },
  moviePrice: { type: Number },
  movieDescription: { type: String },
  foodItems: [
    {
      title: { type: String, required: true },
      imageUrl: { type: String, required: true },
      foodPrice: { type: Number, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("Moviehall", MoviehallSchema);
