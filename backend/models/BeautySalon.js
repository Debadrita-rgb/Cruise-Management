const mongoose = require("mongoose");

const BeautySalonSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  servicedescription: { type: String },
  serviceimage: { type: String },
  category: {
    type: String,
    required: true,
  },
  service: [
    {
      serviceslot: {
        type: String,
        required: true,
        validate: {
          validator: function (arr) {
            return arr.length > 0;
          },
          message: "At least one service slot is required",
        },
      },
      serviceprovidecount: {
        type: String,
        required: true,
        validate: {
          validator: function (arr) {
            return arr.length > 0;
          },
          message: "At least one service count is required",
        },
      },
    },
  ],
  // serviceslot: {
  //   type: [String],
  //   required: true,
  //   validate: {
  //     validator: function (arr) {
  //       return arr.length > 0;
  //     },
  //     message: "At least one service slot is required",
  //   },
  // },
  // serviceprovidecount: { type: String },
  servicetime: { type: String },
  price: { type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("BeautySalon", BeautySalonSchema);
