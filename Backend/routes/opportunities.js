const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createOpportunity, getOpportunities } = require("../controllers/opportunityController");

const router = express.Router();

router.post("/", authMiddleware, createOpportunity);
router.get("/", getOpportunities);

module.exports = router;
