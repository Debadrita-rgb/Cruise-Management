const mongoose = require("mongoose");

const cateringOrderSchema = new mongoose.Schema({
  voyagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  headcookId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
  serviceType: { type: String, default: "Catering" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CateringOrder", cateringOrderSchema);
