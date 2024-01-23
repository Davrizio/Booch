const mongoose = require("mongoose");

const BrewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    require: true
  },
  cloudinaryId: {
    type: String,
    require: true
  },
  note: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  steps: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Brew", BrewSchema);
