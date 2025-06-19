const mongoose = require("mongoose");

const SlotUsageSalonSchema = new mongoose.Schema({
  salonId: mongoose.Schema.Types.ObjectId,
  serviceslot: String,
  bookingdate: String,
  usedCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("SlotUsageSalon", SlotUsageSalonSchema);
