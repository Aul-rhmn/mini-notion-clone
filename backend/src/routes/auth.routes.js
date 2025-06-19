const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;