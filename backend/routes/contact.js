// backend/routes/contact.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { sendContact, getMessages } = require('../controllers/contactController');
const ContactMessage = require('../models/ContactMessage'); // Ensure the model is imported

const router = express.Router();

// Public route: No authentication required
router.post('/', sendContact);

// Protected routes: Require JWT token
router.get('/', protect, getMessages);
router.put('/:id/read', protect, async (req, res) => {
  try {
    const contact = await ContactMessage.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    await contact.update({ isRead: true });
    res.json({ message: 'Message marqué comme lu' });
  } catch (error) {
    console.error('Error in marking message as read:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du message' });
  }
});
router.delete('/:id', protect, async (req, res) => {
  try {
    const contact = await ContactMessage.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    await contact.destroy();
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Error in deleting message:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
});

module.exports = router;