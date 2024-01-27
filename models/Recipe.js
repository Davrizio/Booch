const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
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
    type: Array,
    required: true
  },
  steps: {
    type: Array,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  ingredientCount: {
    type: Number,
    required: true
  },
  instructionCount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
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

module.exports = mongoose.model("Recipe", RecipeSchema);
