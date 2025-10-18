const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NGO = require('../models/NGO');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Check if token has Bearer prefix
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    console.log('Processing token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is a volunteer
const isVolunteer = async (req, res, next) => {
  try {
    if (req.user.userType !== 'volunteer') {
      return res.status(403).json({ message: 'Access denied. Volunteers only.' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.volunteer = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is an NGO
const isNGO = async (req, res, next) => {
  try {
    if (req.user.userType !== 'ngo') {
      return res.status(403).json({ message: 'Access denied. NGOs only.' });
    }
    
    const ngo = await NGO.findById(req.user.id);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    req.ngo = ngo;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to get current user (volunteer or NGO)
const getCurrentUser = async (req, res, next) => {
  try {
    let currentUser;
    
    if (req.user.userType === 'volunteer') {
      currentUser = await User.findById(req.user.id).select('-password');
    } else if (req.user.userType === 'ngo') {
      currentUser = await NGO.findById(req.user.id).select('-password');
    }
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.currentUser = currentUser;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  auth,
  isVolunteer,
  isNGO,
  getCurrentUser
};
