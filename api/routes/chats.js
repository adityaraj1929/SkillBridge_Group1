const express = require('express');
const router = express.Router();
const {auth }= require('../middleware/auth');
const Chat = require('../models/Chat');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');

// @route   GET api/chats/conversations
// @desc    Get all conversations for a user
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user.id },
            { receiver: req.user.id }
          ]
        }
      },
      {
        $group: {
          _id: '$opportunity',
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiver', req.user.id] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'opportunities',
          localField: '_id',
          foreignField: '_id',
          as: 'opportunity'
        }
      },
      { $unwind: '$opportunity' },
      {
        $lookup: {
          from: 'users',
          localField: 'opportunity.ngo',
          foreignField: '_id',
          as: 'ngo'
        }
      },
      { $unwind: '$ngo' },
      {
        $lookup: {
          from: 'users',
          localField: 'opportunity.volunteer',
          foreignField: '_id',
          as: 'volunteer'
        }
      },
      { $unwind: '$volunteer' }
    ]);

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/chats/:opportunityId
// @desc    Get chat history for an opportunity
// @access  Private
router.get('/:opportunityId', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      opportunity: req.params.opportunityId,
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
    .sort({ timestamp: 1 })
    .populate('sender', 'firstName lastName organizationName')
    .populate('receiver', 'firstName lastName organizationName');

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// @route   POST api/chats/:opportunityId/:receiverId
// @desc    Send a new message
// @access  Private
router.post('/:opportunityId/:receiverId', auth, async (req, res) => {
  try {
    const newChat = new Chat({
      sender: req.user.id,
      receiver: req.params.receiverId,
      message: req.body.message,
      opportunity: req.params.opportunityId
    });

    const chat = await newChat.save();
    const populatedChat = await Chat.findById(chat._id)
      .populate('sender', 'firstName lastName organizationName')
      .populate('receiver', 'firstName lastName organizationName');

    res.json(populatedChat);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;