const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opportunity",
    required: true
  },
  status: {
    type: String,
    enum: ["applied", "accepted", "rejected"],
    default: "applied"
  }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
