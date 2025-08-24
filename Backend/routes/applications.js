const express = require("express");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Volunteer applies to an opportunity
router.post("/:opportunityId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can apply" });
    }

    // Prevent duplicate applications
    const existing = await Application.findOne({
      volunteerId: req.user.id,
      opportunityId: req.params.opportunityId
    });
    if (existing) {
      return res.status(400).json({ message: "Already applied to this opportunity" });
    }

    const application = new Application({
      volunteerId: req.user.id,
      opportunityId: req.params.opportunityId
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Volunteer views all their applications
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can view their applications" });
    }

    const applications = await Application.find({ volunteerId: req.user.id })
      .populate("opportunityId", "title description location duration");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// NGO can view applications for their opportunity
router.get("/:opportunityId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can view applications" });
    }

    const applications = await Application.find({ opportunityId: req.params.opportunityId })
      .populate("volunteerId", "name email skills");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// NGO updates application status (accept/reject)
router.put("/:applicationId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can update applications" });
    }

    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status },
      { new: true }
    ).populate("volunteerId", "name email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
