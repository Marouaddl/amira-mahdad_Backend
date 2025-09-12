const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const profileRoutes = require('./routes/profile');
const settingsRoutes = require('./routes/settings');
const portfolioRoutes = require('./routes/portfolio');
const contactRoutes = require('./routes/contact');

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: 'https://amira-mahdad.netlify.app',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads'); // <-- all lowercase
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log(`📁 Dossier 'uploads' créé à ${uploadsDir}`);
}

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    message: '✅ Serveur en cours d\'exécution',
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Erreur:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Fichier trop volumineux (max 50MB)' });
  }
  if (err.message === 'Type de fichier non autorisé !') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📁 URL locale: http://localhost:${PORT}`);
  console.log(`📂 Dossier uploads accessible à http://localhost:${PORT}/uploads`);
});
