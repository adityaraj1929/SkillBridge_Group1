const express = require('express');
const { body, validationResult } = require('express-validator');
const Opportunity = require('../models/Opportunity');
const NGO = require('../models/NGO');
const { auth, isNGO } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/opportunities
// @desc    Get all opportunities with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      location,
      duration,
      timeCommitment,
      skills,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {
      status: 'Active',
      applicationDeadline: { $gt: new Date() },
      $expr: { $lt: ['$currentVolunteers', '$maxVolunteers'] }
    };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Location filter
    if (location) {
      query.$or = [
        { 'location.address.city': { $regex: location, $options: 'i' } },
        { 'location.address.state': { $regex: location, $options: 'i' } },
        { 'location.type': { $regex: location, $options: 'i' } }
      ];
    }

    // Duration filter
    if (duration) {
      query.duration = duration;
    }

    // Time commitment filter
    if (timeCommitment) {
      query.timeCommitment = timeCommitment;
    }

    // Skills filter
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query['skillsRequired.name'] = { $in: skillsArray };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const opportunities = await Opportunity.find(query)
      .populate('ngo', 'organizationName logo address.city address.state')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Opportunity.countDocuments(query);

    res.json({
      opportunities,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/opportunities/:id
// @desc    Get opportunity by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('ngo', 'organizationName description logo website address contactPerson focusAreas establishedYear');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Increment view count
    opportunity.views += 1;
    await opportunity.save();

    res.json({ opportunity });
  } catch (error) {
    console.error('Get opportunity by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/opportunities
// @desc    Create new opportunity
// @access  Private (NGOs only)
router.post('/', [
  auth,
  isNGO,
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('category').isIn(['Education', 'Healthcare', 'Environment', 'Poverty', 'Technology', 'Arts', 'Sports', 'Human Rights', 'Animal Welfare', 'Disaster Relief', 'Other']),
  body('duration').isIn(['1-2 weeks', '1 month', '2-3 months', '6 months', '1 year', 'Ongoing', 'Flexible']),
  body('timeCommitment').isIn(['Full-time', 'Part-time', 'Weekends', 'Flexible']),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('applicationDeadline').isISO8601().withMessage('Valid application deadline is required'),
  body('maxVolunteers').isInt({ min: 1 }).withMessage('At least 1 volunteer position is required'),
  body('location.type').isIn(['Remote', 'On-site', 'Hybrid']),
  body('skillsRequired').isArray({ min: 1 }).withMessage('At least one skill is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate dates
    const startDate = new Date(req.body.startDate);
    const applicationDeadline = new Date(req.body.applicationDeadline);
    const now = new Date();

    if (applicationDeadline <= now) {
      return res.status(400).json({ message: 'Application deadline must be in the future' });
    }

    if (startDate <= applicationDeadline) {
      return res.status(400).json({ message: 'Start date must be after application deadline' });
    }

    const opportunity = new Opportunity({
      ...req.body,
      ngo: req.user.id
    });

    await opportunity.save();

    // Update NGO's opportunity count
    await NGO.findByIdAndUpdate(req.user.id, {
      $push: { opportunities: opportunity._id },
      $inc: { totalOpportunities: 1 }
    });

    const populatedOpportunity = await Opportunity.findById(opportunity._id)
      .populate('ngo', 'organizationName logo');

    res.status(201).json({
      message: 'Opportunity created successfully',
      opportunity: populatedOpportunity
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
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

// @route   PUT /api/opportunities/:id
// @desc    Update opportunity
// @access  Private (NGOs only - own opportunities)
router.put('/:id', [
  auth,
  isNGO,
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isLength({ min: 1, max: 2000 }),
  body('category').optional().isIn(['Education', 'Healthcare', 'Environment', 'Poverty', 'Technology', 'Arts', 'Sports', 'Human Rights', 'Animal Welfare', 'Disaster Relief', 'Other']),
  body('duration').optional().isIn(['1-2 weeks', '1 month', '2-3 months', '6 months', '1 year', 'Ongoing', 'Flexible']),
  body('timeCommitment').optional().isIn(['Full-time', 'Part-time', 'Weekends', 'Flexible']),
  body('startDate').optional().isISO8601(),
  body('applicationDeadline').optional().isISO8601(),
  body('maxVolunteers').optional().isInt({ min: 1 }),
  body('status').optional().isIn(['Draft', 'Active', 'Paused', 'Completed', 'Cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const opportunity = await Opportunity.findOne({
      _id: req.params.id,
      ngo: req.user.id
    });

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found or unauthorized' });
    }

    // Validate dates if provided
    if (req.body.startDate || req.body.applicationDeadline) {
      const startDate = new Date(req.body.startDate || opportunity.startDate);
      const applicationDeadline = new Date(req.body.applicationDeadline || opportunity.applicationDeadline);

      if (startDate <= applicationDeadline) {
        return res.status(400).json({ message: 'Start date must be after application deadline' });
      }
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        opportunity[key] = req.body[key];
      }
    });

    await opportunity.save();

    const updatedOpportunity = await Opportunity.findById(opportunity._id)
      .populate('ngo', 'organizationName logo');

    res.json({
      message: 'Opportunity updated successfully',
      opportunity: updatedOpportunity
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/opportunities/:id
// @desc    Delete opportunity
// @access  Private (NGOs only - own opportunities)
router.delete('/:id', auth, isNGO, async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({
      _id: req.params.id,
      ngo: req.user.id
    });

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found or unauthorized' });
    }

    // Check if there are accepted applications
    const hasAcceptedApplications = opportunity.applications.some(
      app => app.status === 'Accepted'
    );

    if (hasAcceptedApplications) {
      return res.status(400).json({ 
        message: 'Cannot delete opportunity with accepted applications. Please complete or cancel the opportunity instead.' 
      });
    }

    await Opportunity.findByIdAndDelete(req.params.id);

    // Update NGO's opportunity count
    await NGO.findByIdAndUpdate(req.user.id, {
      $pull: { opportunities: req.params.id },
      $inc: { totalOpportunities: -1 }
    });

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/opportunities/categories/list
// @desc    Get list of all categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      'Education', 'Healthcare', 'Environment', 'Poverty', 'Technology',
      'Arts', 'Sports', 'Human Rights', 'Animal Welfare', 'Disaster Relief', 'Other'
    ];
    
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/opportunities/featured
// @desc    Get featured opportunities
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredOpportunities = await Opportunity.find({
      status: 'Active',
      featured: true,
      applicationDeadline: { $gt: new Date() },
      $expr: { $lt: ['$currentVolunteers', '$maxVolunteers'] }
    })
      .populate('ngo', 'organizationName logo')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({ opportunities: featuredOpportunities });
  } catch (error) {
    console.error('Get featured opportunities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
