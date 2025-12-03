const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const NGO = require('../models/NGO');
const { auth, getCurrentUser } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Generate JWT Token
const generateToken = (id, userType) => {
  // Ensure expiresIn is always a valid value for jsonwebtoken
  const rawExpiresIn = process.env.JWT_EXPIRE;
  const expiresIn =
    rawExpiresIn && rawExpiresIn !== 'undefined' && rawExpiresIn !== 'null'
      ? rawExpiresIn
      : '7d'; // sensible default

  return jwt.sign(
    { id, userType },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// @route   POST /api/auth/register/volunteer
// @desc    Register a new volunteer
// @access  Public
router.post('/register/volunteer', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('availability').notEmpty().withMessage('Availability is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if NGO exists with same email
    let existingNGO = await NGO.findOne({ email });
    if (existingNGO) {
      return res.status(400).json({ message: 'An NGO account already exists with this email' });
    }

    // Create new user
    const user = new User(req.body);
    await user.save();

    // Generate token
    const token = generateToken(user._id, 'volunteer');

    res.status(201).json({
      message: 'Volunteer registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: 'volunteer'
      }
    });
  } catch (error) {
    console.error('Volunteer registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/register/ngo
// @desc    Register a new NGO
// @access  Public
router.post('/register/ngo', [
  body('organizationName').notEmpty().withMessage('Organization name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('registrationNumber').notEmpty().withMessage('Registration number is required'),
  body('establishedYear').isInt({ min: 1800 }).withMessage('Please enter a valid established year'),
  body('organizationType').notEmpty().withMessage('Organization type is required'),
  body('mission').notEmpty().withMessage('Mission statement is required'),
  body('description').notEmpty().withMessage('Organization description is required'),
  body('contactPerson.name').notEmpty().withMessage('Contact person name is required'),
  body('contactPerson.designation').notEmpty().withMessage('Contact person designation is required'),
  body('contactPerson.email').isEmail().withMessage('Contact person email must be valid'),
  body('contactPerson.phone').notEmpty().withMessage('Contact person phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, registrationNumber } = req.body;

    // Check if NGO already exists
    let existingNGO = await NGO.findOne({ 
      $or: [{ email }, { registrationNumber }] 
    });
    if (existingNGO) {
      return res.status(400).json({ 
        message: 'NGO already exists with this email or registration number' 
      });
    }

    // Check if user exists with same email
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A volunteer account already exists with this email' });
    }

    // Create new NGO
    const ngo = new NGO(req.body);
    await ngo.save();

    // Generate token
    const token = generateToken(ngo._id, 'ngo');

    res.status(201).json({
      message: 'NGO registered successfully',
      token,
      user: {
        id: ngo._id,
        organizationName: ngo.organizationName,
        email: ngo.email,
        userType: 'ngo'
      }
    });
  } catch (error) {
    console.error('NGO registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (volunteer or NGO)
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  body('userType').isIn(['volunteer', 'ngo']).withMessage('User type must be volunteer or ngo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userType } = req.body;
    let user;

    // Find user based on type
    if (userType === 'volunteer') {
      user = await User.findOne({ email });
    } else {
      user = await NGO.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Generate token
    const token = generateToken(user._id, userType);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: userType === 'volunteer' ? `${user.firstName} ${user.lastName}` : user.organizationName,
        email: user.email,
        userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getCurrentUser, (req, res) => {
  res.json({
    user: req.currentUser,
    userType: req.user.userType
  });
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('userType').isIn(['volunteer', 'ngo']).withMessage('User type must be volunteer or ngo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, userType } = req.body;
    let user;

    // Find user based on type
    if (userType === 'volunteer') {
      user = await User.findOne({ email });
    } else {
      user = await NGO.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address' });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    // Email content
    const message = `
      <h2>Password Reset Request</h2>
      <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
      <p>Your OTP for password reset is:</p>
      <h1 style="font-size: 32px; letter-spacing: 5px; background-color: #f5f5f5; padding: 10px; text-align: center; font-family: monospace;">${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <br>
      <p>Best regards,<br>SkillBridge Team</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'SkillBridge Password Reset OTP',
        html: message
      });

      res.json({ message: 'OTP sent to your email successfully' });
    } catch (error) {
      console.error('Email send error:', error);
      user.otp.code = null;
      user.otp.expiresAt = null;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for password reset
// @access  Public
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('otp').notEmpty().withMessage('OTP is required'),
  body('userType').isIn(['volunteer', 'ngo']).withMessage('User type must be volunteer or ngo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, userType } = req.body;
    let user;

    // Find user based on type
    if (userType === 'volunteer') {
      user = await User.findOne({ email });
    } else {
      user = await NGO.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address' });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Generate a temporary token for password reset
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Clear OTP
    user.clearOTP();
    await user.save({ validateBeforeSave: false });

    res.json({ 
      message: 'OTP verified successfully',
      resetToken 
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and generate reset token
// @access  Public
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('otp').notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('userType').isIn(['volunteer', 'ngo']).withMessage('User type must be volunteer or ngo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, userType } = req.body;
    let user;

    // Find user based on type
    if (userType === 'volunteer') {
      user = await User.findOne({ email });
    } else {
      user = await NGO.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address' });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Generate reset token (valid for 5 minutes)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

    // Clear OTP after successful verification
    user.clearOTP();
    await user.save({ validateBeforeSave: false });

    res.json({
      message: 'OTP verified successfully',
      resetToken
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/reset-password/:resettoken
// @desc    Reset password using token received after OTP verification
// @access  Public
router.put('/reset-password/:resettoken', [
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character'),
  body('userType').isIn(['volunteer', 'ngo']).withMessage('User type must be volunteer or ngo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const { password, userType } = req.body;
    let user;

    // Find user by token and check if token is not expired
    if (userType === 'volunteer') {
      user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
    } else {
      user = await NGO.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate new JWT token for auto-login
    const token = generateToken(user._id, userType);

    res.json({
      message: 'Password reset successful',
      token,
      user: {
        id: user._id,
        name: userType === 'volunteer' ? `${user.firstName} ${user.lastName}` : user.organizationName,
        email: user.email,
        userType
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
