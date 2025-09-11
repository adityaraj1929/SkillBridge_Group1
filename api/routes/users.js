const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const { auth, isVolunteer } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private (Volunteers only)
router.get('/profile', auth, isVolunteer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('appliedOpportunities.opportunity', 'title ngo startDate endDate status');
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private (Volunteers only)
router.put('/profile', [
  auth,
  isVolunteer,
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/),
  body('bio').optional().isLength({ max: 500 }),
  body('skills').optional().isArray(),
  body('preferredCauses').optional().isArray(),
  body('availability').optional().isIn(['Full-time', 'Part-time', 'Weekends', 'Flexible'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateFields = {};
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'bio', 'skills', 
      'preferredCauses', 'availability', 'education', 'experience'
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

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
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

// @route   POST /api/users/apply/:opportunityId
// @desc    Apply for an opportunity
// @access  Private (Volunteers only)
router.post('/apply/:opportunityId', [
  auth,
  isVolunteer,
  body('coverLetter').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { opportunityId } = req.params;
    const { coverLetter } = req.body;

    // Check if opportunity exists and is active
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.status !== 'Active') {
      return res.status(400).json({ message: 'This opportunity is not accepting applications' });
    }

    if (new Date() > opportunity.applicationDeadline) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    if (opportunity.currentVolunteers >= opportunity.maxVolunteers) {
      return res.status(400).json({ message: 'This opportunity is full' });
    }

    // Check if user already applied
    const existingApplication = opportunity.applications.find(
      app => app.volunteer.toString() === req.user.id
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this opportunity' });
    }

    // Add application to opportunity
    opportunity.applications.push({
      volunteer: req.user.id,
      coverLetter: coverLetter || '',
      status: 'Pending'
    });

    await opportunity.save();

    // Add to user's applied opportunities
    const user = await User.findById(req.user.id);
    user.appliedOpportunities.push({
      opportunity: opportunityId,
      status: 'Pending'
    });

    await user.save();

    res.json({ 
      message: 'Application submitted successfully',
      applicationId: opportunity.applications[opportunity.applications.length - 1]._id
    });
  } catch (error) {
    console.error('Apply for opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/applications
// @desc    Get user's applications
// @access  Private (Volunteers only)
router.get('/applications', auth, isVolunteer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'appliedOpportunities.opportunity',
        populate: {
          path: 'ngo',
          select: 'organizationName logo'
        }
      });

    const applications = user.appliedOpportunities.map(app => ({
      _id: app._id,
      opportunity: app.opportunity,
      appliedAt: app.appliedAt,
      status: app.status
    }));

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/applications/:applicationId/withdraw
// @desc    Withdraw application
// @access  Private (Volunteers only)
router.put('/applications/:applicationId/withdraw', auth, isVolunteer, async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Find and update user's application
    const user = await User.findById(req.user.id);
    const userApplication = user.appliedOpportunities.id(applicationId);

    if (!userApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (userApplication.status === 'Withdrawn') {
      return res.status(400).json({ message: 'Application already withdrawn' });
    }

    userApplication.status = 'Withdrawn';
    await user.save();

    // Update opportunity's application status
    const opportunity = await Opportunity.findById(userApplication.opportunity);
    if (opportunity) {
      const oppApplication = opportunity.applications.find(
        app => app.volunteer.toString() === req.user.id
      );
      if (oppApplication) {
        oppApplication.status = 'Withdrawn';
        await opportunity.save();
      }
    }

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/recommendations
// @desc    Get recommended opportunities for user
// @access  Private (Volunteers only)
router.get('/recommendations', auth, isVolunteer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Build query based on user preferences
    const query = {
      status: 'Active',
      applicationDeadline: { $gt: new Date() },
      $expr: { $lt: ['$currentVolunteers', '$maxVolunteers'] }
    };

    // Filter by preferred causes
    if (user.preferredCauses && user.preferredCauses.length > 0) {
      query.category = { $in: user.preferredCauses };
    }

    // Filter by user skills
    if (user.skills && user.skills.length > 0) {
      const userSkillNames = user.skills.map(skill => skill.name);
      query['skillsRequired.name'] = { $in: userSkillNames };
    }

    // Filter by availability
    if (user.availability) {
      query.timeCommitment = { $in: [user.availability, 'Flexible'] };
    }

    const recommendations = await Opportunity.find(query)
      .populate('ngo', 'organizationName logo')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
