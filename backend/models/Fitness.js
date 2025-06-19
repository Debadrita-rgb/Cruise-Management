const mongoose = require("mongoose");

const FitnessSchema = new mongoose.Schema({
  servicename: { type: String },
  servicedescription: { type: String },
  serviceimage: { type: String },
  price: { type: Number },
  serviceslot: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "At least one service slot is required",
    },
  },
  equipmentItems: [
    {
      title: { type: String, required: true },
      imageUrl: { type: String, required: true },
    },
  ],
  trainer: { type: String },
  category: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true, // This determines if the item is active
  },
});
module.exports = mongoose.model("Fitness", FitnessSchema);
