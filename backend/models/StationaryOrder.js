const mongoose = require("mongoose");

const stationaryOrderSchema = new mongoose.Schema({
  voyagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      name: String,
      quantity: { type: Number, default: 1 },
      image: String,
      price: Number,
      status: { type: String, default: "AddItem" },
    },
  ],
  status: [String],
  serviceType: { type: String, default: "Stationary" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StationaryOrder", stationaryOrderSchema);
