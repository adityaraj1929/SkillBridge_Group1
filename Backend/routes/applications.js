const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { apply, getMyApplications, getApplicationsByOpportunity, updateApplicationStatus } = require("../controllers/applicationController");

const router = express.Router();

router.post("/:opportunityId", authMiddleware, apply);
router.get("/my", authMiddleware, getMyApplications);
router.get("/:opportunityId", authMiddleware, getApplicationsByOpportunity);
router.put("/:applicationId", authMiddleware, updateApplicationStatus);

module.exports = router;
