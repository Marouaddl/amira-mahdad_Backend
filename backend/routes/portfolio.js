const express = require('express');
const { protect } = require('../middleware/auth');
const { sendContact, getMessages } = require('../controllers/contactController');
const router = express.Router();

router.post('/', sendContact);  // Publique
router.get('/', protect, getMessages);  // Protégée pour admin

module.exports = router;