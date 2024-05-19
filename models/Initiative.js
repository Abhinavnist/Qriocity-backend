const mongoose = require("mongoose")

const initiativeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: { type: String },
    // Add other fields as needed
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Initiative", initiativeSchema)
