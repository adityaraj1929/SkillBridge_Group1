const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const NGO = require('../models/NGO');
const Opportunity = require('../models/Opportunity');

// Get chat partners for a volunteer (NGOs of accepted applications)
router.get('/volunteer/chat-partners', auth, async (req, res) => {
  try {
    console.log('Getting chat partners for volunteer:', req.user.id);

    // Find all opportunities where this volunteer has an accepted application
    const opportunities = await Opportunity.find({
      'applications': {
        $elemMatch: {
          volunteer: req.user.id,
          status: 'Accepted'
        }
      }
    }).populate('ngo', 'organizationName description logo');

    console.log('Found opportunities:', opportunities.length);

    const chatPartners = opportunities.map(opp => {
      const acceptedApp = opp.applications.find(
        app => app.volunteer.toString() === req.user.id && app.status === 'Accepted'
      );

      return {
        _id: opp.ngo._id,
        name: opp.ngo.organizationName,
        description: opp.ngo.description,
        logo: opp.ngo.logo,
        opportunityId: opp._id,
        opportunityTitle: opp.title,
        applicationId: acceptedApp._id
      };
    });

    console.log('Sending chat partners:', chatPartners);

    res.json({
      success: true,
      partners: chatPartners
    });
  } catch (error) {
    console.error('Error getting chat partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get chat partners for an NGO (volunteers with accepted applications)
router.get('/ngo/chat-partners', auth, async (req, res) => {
  try {
    const ngo = await NGO.findById(req.user.id);
    if (!ngo) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Getting chat partners for NGO:', req.user.id);
    
    const opportunities = await Opportunity.find({ 
      ngo: req.user.id,
      'applications.status': 'Accepted'
    }).populate('applications.volunteer', 'firstName lastName email profilePicture');

    console.log('Found opportunities with accepted applications:', opportunities.length);
    
    const chatPartners = new Map(); // Use Map to avoid duplicates

    opportunities.forEach(opp => {
      const acceptedApplications = opp.applications.filter(app => app.status === 'Accepted');
      
      acceptedApplications.forEach(app => {
        const volunteer = app.volunteer;
        if (!chatPartners.has(volunteer._id.toString())) {
          chatPartners.set(volunteer._id.toString(), {
            _id: volunteer._id,
            name: `${volunteer.firstName} ${volunteer.lastName}`,
            email: volunteer.email,
            profilePicture: volunteer.profilePicture,
            opportunities: [{
              opportunityId: opp._id,
              opportunityTitle: opp.title,
              applicationId: app._id
            }]
          });
        } else {
          // Add additional opportunities for existing partner
          chatPartners.get(volunteer._id.toString()).opportunities.push({
            opportunityId: opp._id,
            opportunityTitle: opp.title,
            applicationId: app._id
          });
        }
      });
    });

    console.log('Sending chat partners:', Array.from(chatPartners.values()));

    res.json({
      success: true,
      partners: Array.from(chatPartners.values())
    });
  } catch (error) {
    console.error('Error getting chat partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages between two users for a specific opportunity
router.get('/messages/:partnerId', auth, async (req, res) => {
  try {
    const { partnerId } = req.params;
    console.log('Fetching messages with partner:', partnerId);

    // Get the chat messages between the current user and the partner
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: partnerId },
        { senderId: partnerId, receiverId: req.user.id }
      ]
    }).sort({ timestamp: 1 });

    console.log('Found messages:', messages.length);

    res.json({
      success: true,
      messages: messages.map(msg => ({
        senderId: msg.senderId,
        content: msg.content,
        timestamp: msg.timestamp,
        opportunityId: msg.opportunityId
      }))
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;