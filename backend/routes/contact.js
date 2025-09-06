const express = require('express');
const router = express.Router();
const { sendContact, getMessages } = require('../controllers/contactController');

router.post('/', sendContact);
router.get('/', getMessages);
router.put('/:id/read', async (req, res) => {
  try {
    const contact = await ContactMessage.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    await contact.update({ isRead: true });
    res.json({ message: 'Message marqué comme lu' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du message' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const contact = await ContactMessage.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    await contact.destroy();
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
});

module.exports = router;