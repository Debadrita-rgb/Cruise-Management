const mongoose = require("mongoose");

const PartyHallSchema = new mongoose.Schema({
  hallName: { type: String, required: true },
  capacity: Number,
  availability: Boolean,
  description: { type: String },
  price: { type: String },
  images: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("PartyHall", PartyHallSchema);
