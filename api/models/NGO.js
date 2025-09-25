const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const NGOSchema = new mongoose.Schema({
  // Basic Information
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  // Contact Information
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  
  // Address Information
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' }
  },
  
  // Organization Details
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true
  },
  establishedYear: {
    type: Number,
    required: [true, 'Established year is required'],
    min: [1800, 'Please enter a valid year'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  organizationType: {
    type: String,
    required: [true, 'Organization type is required'],
    enum: ['NGO', 'Non-Profit', 'Charity', 'Foundation', 'Trust', 'Society', 'Other']
  },
  
  // Mission and Focus
  mission: {
    type: String,
    required: [true, 'Mission statement is required'],
    maxlength: [1000, 'Mission cannot exceed 1000 characters']
  },
  description: {
    type: String,
    required: [true, 'Organization description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  focusAreas: [{
    type: String,
    enum: ['Education', 'Healthcare', 'Environment', 'Poverty', 'Technology', 'Arts', 'Sports', 'Human Rights', 'Animal Welfare', 'Disaster Relief', 'Other'],
    required: true
  }],
  
  // Contact Person
  contactPerson: {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  
  // Verification and Documents
  documents: [{
    type: { 
      type: String, 
      enum: ['Registration Certificate', 'Tax Exemption', 'Annual Report', 'Other'],
      required: true 
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Social Media
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String }
  },
  
  // Profile Information
  logo: {
    type: String,
    default: ''
  },
  
  // Posted Opportunities
  opportunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  }],
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  totalOpportunities: {
    type: Number,
    default: 0
  },
  totalVolunteers: {
    type: Number,
    default: 0
  },

  // Password Reset and OTP
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  otp: {
    code: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
NGOSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
NGOSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate password reset token
NGOSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate OTP
NGOSchema.methods.generateOTP = function() {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store the OTP and set expiry (10 minutes)
  this.otp.code = otp;
  this.otp.expiresAt = Date.now() + 10 * 60 * 1000;
  
  return otp;
};

// Verify OTP
NGOSchema.methods.verifyOTP = function(candidateOTP) {
  return this.otp.code === candidateOTP && this.otp.expiresAt > Date.now();
};

// Clear OTP after use
NGOSchema.methods.clearOTP = function() {
  this.otp.code = null;
  this.otp.expiresAt = null;
};

module.exports = mongoose.model('NGO', NGOSchema);
