const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

exports.sendContact = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  try {
    // Enregistrer dans la base de données
    const contact = await ContactMessage.create({ firstName, lastName, email, message });

    // Optionnel: Envoyer email à l'admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER, // Définir dans .env
        pass: process.env.NODEMAILER_PASS, // Définir dans .env
      },
    });

    await transporter.sendMail({
      from: email,
      to: 'mahdadamirarihab@gmail.com', // Remplace par ton email
      subject: `Nouveau message de contact de ${firstName} ${lastName}`,
      text: `Nom: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.json({ message: 'Message envoyé avec succès', contact });
  } catch (err) {
    console.error('Erreur lors de l\'envoi du message:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};