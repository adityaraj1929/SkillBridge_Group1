const Opportunity = require("../models/Opportunity");

// ---------------- NGO creates an opportunity ----------------
exports.createOpportunity = async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can create opportunities" });
    }

    const { title, description, requiredSkills, location, duration } = req.body;

    // ✅ Basic validation
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Get all opportunities ----------------
exports.getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("ngoId", "name email"); // show NGO info

    res.json(opportunities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Get single opportunity by ID ----------------
exports.getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate("ngoId", "name email");

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- NGO deletes their own opportunity ----------------
exports.deleteOpportunity = async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can delete opportunities" });
    }

    const opportunity = await Opportunity.findOneAndDelete({
      _id: req.params.id,
      ngoId: req.user.id
    });

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found or not yours" });
    }

    res.json({ message: "Opportunity deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
