const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};

    // Common updatable
    ['name', 'location', 'bio', 'website_url', 'organization_name', 'organization_description'].forEach(k => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    // skills can be array or comma string
    if (req.body.skills !== undefined) {
      updates.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : (typeof req.body.skills === 'string' ? req.body.skills.split(',').map(s => s.trim()) : []);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
