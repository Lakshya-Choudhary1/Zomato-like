import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  recipeName: {
    type: String,
    required: true,
  },
  recipeVideo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tags: {
    type: [String], 
    default: [],
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
});

export default mongoose.model("Food", foodSchema);
