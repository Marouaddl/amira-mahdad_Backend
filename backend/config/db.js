const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connecté avec succès');
    
    // Synchroniser la base de données après la connexion
    await syncDB();
  } catch (err) {
    console.error('Erreur de connexion à PostgreSQL:', err.message);
    process.exit(1);
  }
};

const syncDB = async () => {
  try {
    // Utiliser alter: true au lieu de force: true pour préserver les données existantes
    await sequelize.sync({ alter: true });
    console.log('Base de données et tables synchronisées');
    
    const User = require('../models/User');
    
    // Vérifier si l'utilisateur admin existe déjà
    const existingUser = await User.findOne({ where: { username: 'admin' } });
    if (!existingUser) {
      await User.create({
        username: 'admin',
        password: await bcrypt.hash('amira', 10),
      });
      console.log('Utilisateur admin créé avec succès');
    } else {
      console.log('Utilisateur admin existe déjà');
    }
  } catch (err) {
    console.error('Erreur de synchronisation:', err.message);
  }
};

module.exports = { sequelize, connectDB, syncDB };