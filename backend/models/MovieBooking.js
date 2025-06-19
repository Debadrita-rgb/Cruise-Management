const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Moviehall",
    required: true,
  },
  date: { type: String, required: true },
  timeSlotId: { type: String, required: true },
  seatsBooked: [{ type: Number }],
  totalPrice: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const MovieBooking = mongoose.model("MovieBooking", bookingSchema);

module.exports = MovieBooking;
