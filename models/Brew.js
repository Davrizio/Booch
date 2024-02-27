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
  tea: {
    type: String,
    required: true
  },
  recipe: {
    type: String,
    required: true
  },
  firstFerment: {
    type: Array,
    required: true
  },
  secondFerment: {
    type: Array,
    required: true
  },
  thirdFerment: {
    type: Array,
    required: true
  },
  avgTemp: {
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
