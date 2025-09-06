const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: { type: DataTypes.STRING, allowNull: true },
  title: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  experience: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  location: { type: DataTypes.STRING, allowNull: true },
  projectsCompleted: { type: DataTypes.STRING, allowNull: true },
  satisfiedClients: { type: DataTypes.STRING, allowNull: true },
  certifications: { type: DataTypes.STRING, allowNull: true },
}, {
  timestamps: true,
  // Supprimez le champ yearsExperience s'il existe dans la base
});

module.exports = Profile;