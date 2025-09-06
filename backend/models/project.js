const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true }, // Peut être null si une vidéo est utilisée
  video: { type: DataTypes.STRING, allowNull: true }, // URL de la vidéo principale
  additionalImages: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] }, // Tableau d'URLs
}, {
  timestamps: true,
});

module.exports = Project;