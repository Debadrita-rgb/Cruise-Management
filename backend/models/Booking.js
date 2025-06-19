const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  voyagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "Booking" },
  type: String,
  details: Object,
  createdAt: { type: Date, default: Date.now },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Booking", BookingSchema);
