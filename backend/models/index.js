const { sequelize } = require('../config/db');
const Project = require('./project');
const Contact = require('./ContactMessage');
// Add other models here as needed

module.exports = {
  sequelize,
  Project,
  Contact,
};