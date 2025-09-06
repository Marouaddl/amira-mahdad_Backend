const express = require('express');
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profileController');
const router = express.Router();

router.use(protect);
router.get('/', getProfile);
router.put('/', updateProfile);


module.exports = router;