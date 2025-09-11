const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Opportunity title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // NGO Information
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true
  },
  
  // Opportunity Details
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Education', 'Healthcare', 'Environment', 'Poverty', 'Technology', 'Arts', 'Sports', 'Human Rights', 'Animal Welfare', 'Disaster Relief', 'Other']
  },
  skillsRequired: [{
    name: { type: String, required: true },
    level: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true 
    },
    description: { type: String }
  }],
  
  // Time and Duration
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    enum: ['1-2 weeks', '1 month', '2-3 months', '6 months', '1 year', 'Ongoing', 'Flexible']
  },
  timeCommitment: {
    type: String,
    required: [true, 'Time commitment is required'],
    enum: ['Full-time', 'Part-time', 'Weekends', 'Flexible']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      required: true
    },
    address: {
      street: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String },
      country: { type: String, required: true, default: 'India' }
    }
  },
  
  // Requirements
  requirements: {
    minAge: { type: Number, min: 16, max: 100 },
    maxAge: { type: Number, min: 16, max: 100 },
    education: { 
      type: String,
      enum: ['No specific requirement', 'High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Professional Certification']
    },
    experience: {
      type: String,
      enum: ['No experience required', '1-2 years', '3-5 years', '5+ years']
    },
    languages: [{ type: String }],
    additionalRequirements: { type: String, maxlength: 500 }
  },
  
  // Application Details
  maxVolunteers: {
    type: Number,
    required: [true, 'Maximum number of volunteers is required'],
    min: [1, 'At least 1 volunteer position is required']
  },
  currentVolunteers: {
    type: Number,
    default: 0
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  
  // Benefits and Compensation
  benefits: [{
    type: String,
    enum: ['Certificate', 'Letter of Recommendation', 'Skill Development', 'Networking', 'Travel Allowance', 'Accommodation', 'Meals', 'Stipend', 'Other']
  }],
  stipend: {
    amount: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    frequency: { 
      type: String, 
      enum: ['One-time', 'Weekly', 'Monthly', 'Per project'] 
    }
  },
  
  // Applications
  applications: [{
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Accepted', 'Rejected', 'Withdrawn'],
      default: 'Pending'
    },
    coverLetter: {
      type: String,
      maxlength: 1000
    },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
    feedback: { type: String }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Paused', 'Completed', 'Cancelled'],
    default: 'Active'
  },
  
  // Metadata
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{ type: String }]
}, {
  timestamps: true
});

// Index for search functionality
OpportunitySchema.index({ 
  title: 'text', 
  description: 'text', 
  'skillsRequired.name': 'text',
  category: 'text'
});

// Virtual for checking if opportunity is still accepting applications
OpportunitySchema.virtual('isAcceptingApplications').get(function() {
  const now = new Date();
  return this.status === 'Active' && 
         this.applicationDeadline > now && 
         this.currentVolunteers < this.maxVolunteers;
});

// Virtual for application count
OpportunitySchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
