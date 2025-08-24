const express = require("express");
const Opportunity = require("../models/Opportunity");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Opportunity (NGO only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can create opportunities" });
    }

    const { title, description, requiredSkills, location, duration } = req.body;

    const opportunity = new Opportunity({
      ngoId: req.user.id,
      title,
      description,
      requiredSkills,
      location,
      duration
    });

    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all opportunities
router.get("/", async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate("ngoId", "name email");
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
