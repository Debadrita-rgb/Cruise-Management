const mongoose = require("mongoose");

const StationarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  quantity: Number,
  image: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("Stationary", StationarySchema);
