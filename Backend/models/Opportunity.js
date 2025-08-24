const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: [String],
    default: []
  },
  location: {
    type: String
  },
  duration: {
    type: String // e.g. "3 months", "2 weeks"
  }
}, { timestamps: true });

module.exports = mongoose.model("Opportunity", opportunitySchema);
