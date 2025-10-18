const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel'
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'NGO']
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['User', 'NGO']
  }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);