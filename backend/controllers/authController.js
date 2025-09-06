const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  // Validation des champs
  if (!username || !password) {
    return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
  }
  
  try {
    // Recherche de l'utilisateur
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    
    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    
    // Génération du token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' } // Token valide 24 heures
    );
    
    res.json({ 
      message: 'Connexion réussie', 
      token,
      user: { id: user.id, username: user.username }
    });
    
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
};