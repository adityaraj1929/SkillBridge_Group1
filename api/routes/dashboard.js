const express = require('express');
const Opportunity = require('../models/Opportunity');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/dashboard/ngo/stats
// @desc    Get NGO dashboard statistics
// @access  Private (NGO only)
router.get('/ngo/stats', auth, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ ngo: req.user.id });
    
    const totalOpportunities = opportunities.length;
    
    const activeOpportunities = opportunities.filter(
      opp => opp.status === 'Active'
    ).length;

    let totalAcceptedVolunteers = 0;
    opportunities.forEach(opportunity => {
      if (opportunity.applications) {
        const acceptedApplications = opportunity.applications.filter(
          app => app.status === 'Accepted'
        );
        totalAcceptedVolunteers += acceptedApplications.length;
      }
    });

    res.json({
      success: true,
      stats: {
        totalOpportunities,
        activeOpportunities,
        totalAcceptedVolunteers
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;