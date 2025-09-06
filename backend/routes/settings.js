const express = require('express');
const { protect } = require('../middleware/auth');
const { changePassword } = require('../controllers/settingsController');
const router = express.Router();

router.use(protect);
router.put('/password', changePassword);

module.exports = router;