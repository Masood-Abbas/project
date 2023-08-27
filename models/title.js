const mongoose = require("mongoose");

const titleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
    createdAt: { type: Date, default: Date.now }
  
  // Add other fields as needed
});

const Title = mongoose.model("Title", titleSchema);

module.exports = Title;
