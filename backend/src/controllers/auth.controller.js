const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};


const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ email, password });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      email: user.email,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};


const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


const getUserProfile = async (req, res) => {
    if (req.user) {
        res.json({
            _id: req.user._id,
            email: req.user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


module.exports = { registerUser, loginUser, logoutUser, getUserProfile };