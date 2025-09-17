// backend/routes/profile.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profileController');
const router = express.Router();

// Public route: No authentication required
router.get('/', getProfile);

// Protected route: Require JWT token
router.put('/', protect, updateProfile);

module.exports = router;