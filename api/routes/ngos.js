const express = require('express');
const { body, validationResult } = require('express-validator');
const NGO = require('../models/NGO');
const Opportunity = require('../models/Opportunity');
const { auth, isNGO } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/ngos/profile
// @desc    Get current NGO profile
// @access  Private (NGOs only)
router.get('/profile', auth, isNGO, async (req, res) => {
  try {
    const ngo = await NGO.findById(req.user.id)
      .select('-password')
      .populate('opportunities');
    
    res.json({ ngo });
  } catch (error) {
    console.error('Get NGO profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ngos/profile
// @desc    Update NGO profile
// @access  Private (NGOs only)
router.put('/profile', [
  auth,
  isNGO,
  body('organizationName').optional().trim().isLength({ min: 1, max: 100 }),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/),
  body('website').optional().isURL(),
  body('mission').optional().isLength({ max: 1000 }),
  body('description').optional().isLength({ max: 2000 }),
  body('focusAreas').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateFields = {};
    const allowedFields = [
      'organizationName', 'phone', 'website', 'mission', 'description',
      'focusAreas', 'contactPerson', 'socialMedia'
    ];

    // Only update provided fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // Handle address update
    if (req.body.address) {
      updateFields.address = req.body.address;
    }

    const ngo = await NGO.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ 
      message: 'Profile updated successfully',
      ngo 
    });
  } catch (error) {
    console.error('Update NGO profile error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/opportunities
// @desc    Get NGO's opportunities
// @access  Private (NGOs only)
router.get('/opportunities', auth, isNGO, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { ngo: req.user.id };
    if (status) {
      query.status = status;
    }

    const opportunities = await Opportunity.find(query)
      .populate('applications.volunteer', 'firstName lastName email skills')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Opportunity.countDocuments(query);

    res.json({
      opportunities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get NGO opportunities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/applications
// @desc    Get applications for NGO's opportunities
// @access  Private (NGOs only)
router.get('/applications', auth, isNGO, async (req, res) => {
  try {
    const { status, opportunityId, page = 1, limit = 10 } = req.query;
    
    const query = { ngo: req.user.id };
    if (opportunityId) {
      query._id = opportunityId;
    }

    const opportunities = await Opportunity.find(query)
      .populate('applications.volunteer', 'firstName lastName email phone skills bio')
      .select('title applications');

    // Flatten applications and filter by status if provided
    let allApplications = [];
    opportunities.forEach(opp => {
      opp.applications.forEach(app => {
        if (!status || app.status === status) {
          allApplications.push({
            ...app.toObject(),
            opportunityTitle: opp.title,
            opportunityId: opp._id
          });
        }
      });
    });

    // Sort by application date (newest first)
    allApplications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedApplications = allApplications.slice(startIndex, endIndex);

    res.json({
      applications: paginatedApplications,
      totalPages: Math.ceil(allApplications.length / limit),
      currentPage: parseInt(page),
      total: allApplications.length
    });
  } catch (error) {
    console.error('Get NGO applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ngos/applications/:applicationId/status
// @desc    Update application status
// @access  Private (NGOs only)
router.put('/applications/:applicationId/status', [
  auth,
  isNGO,
  body('status').isIn(['Pending', 'Under Review', 'Accepted', 'Rejected']),
  body('feedback').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { applicationId } = req.params;
    const { status, feedback } = req.body;

    // Find the opportunity with this application
    const opportunity = await Opportunity.findOne({
      ngo: req.user.id,
      'applications._id': applicationId
    });

    if (!opportunity) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application status
    const application = opportunity.applications.id(applicationId);
    application.status = status;
    application.reviewedAt = new Date();
    if (feedback) {
      application.feedback = feedback;
    }

    // If accepted, increment current volunteers count
    if (status === 'Accepted' && application.status !== 'Accepted') {
      opportunity.currentVolunteers += 1;
    }

    await opportunity.save();

    // Update user's application status as well
    const User = require('../models/User');
    
    // Find user and update their application
    const user = await User.findOne({
      _id: application.volunteer,
      'appliedOpportunities.opportunity': opportunity._id
    });

    if (user) {
      const appIndex = user.appliedOpportunities.findIndex(
        app => app.opportunity.toString() === opportunity._id.toString()
      );

      if (appIndex !== -1) {
        user.appliedOpportunities[appIndex].status = status;
        user.appliedOpportunities[appIndex].feedback = feedback;
        user.appliedOpportunities[appIndex].reviewedAt = new Date();
        await user.save();

        console.log('Updated user application status:', {
          userId: user._id,
          opportunityId: opportunity._id,
          newStatus: status,
          appIndex
        });
      }
    }

    res.json({ 
      message: 'Application status updated successfully',
      application: {
        _id: application._id,
        status: application.status,
        reviewedAt: application.reviewedAt,
        feedback: application.feedback
      }
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/dashboard/stats
// @desc    Get NGO dashboard statistics
// @access  Private (NGOs only)
router.get('/dashboard/stats', auth, isNGO, async (req, res) => {
  try {
    const ngo = await NGO.findById(req.user.id);
    
    // Get opportunity statistics
    const opportunityStats = await Opportunity.aggregate([
      { $match: { ngo: ngo._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get application statistics
    const applicationStats = await Opportunity.aggregate([
      { $match: { ngo: ngo._id } },
      { $unwind: '$applications' },
      {
        $group: {
          _id: '$applications.status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent applications
    const recentApplications = await Opportunity.find({ ngo: ngo._id })
      .populate('applications.volunteer', 'firstName lastName')
      .sort({ 'applications.appliedAt': -1 })
      .limit(5);

    // Flatten recent applications
    let flattenedApplications = [];
    recentApplications.forEach(opp => {
      opp.applications.slice(0, 5).forEach(app => {
        flattenedApplications.push({
          _id: app._id,
          volunteer: app.volunteer,
          appliedAt: app.appliedAt,
          status: app.status,
          opportunityTitle: opp.title
        });
      });
    });

    // Sort and limit
    flattenedApplications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    flattenedApplications = flattenedApplications.slice(0, 5);

    res.json({
      opportunityStats: opportunityStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      applicationStats: applicationStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      recentApplications: flattenedApplications,
      totalOpportunities: ngo.totalOpportunities,
      totalVolunteers: ngo.totalVolunteers
    });
  } catch (error) {
    console.error('Get NGO dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos
// @desc    Get all NGOs (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, focusArea } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { organizationName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (focusArea) {
      query.focusAreas = focusArea;
    }

    const ngos = await NGO.find(query)
      .select('organizationName description focusAreas logo address.city address.state establishedYear')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await NGO.countDocuments(query);

    res.json({
      ngos,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get NGOs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/:id
// @desc    Get NGO by ID (public)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id)
      .select('-password -email')
      .populate({
        path: 'opportunities',
        match: { status: 'Active' },
        select: 'title description category startDate endDate location.type'
      });

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.json({ ngo });
  } catch (error) {
    console.error('Get NGO by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
