const Sequelize = require('sequelize');

const sequelize = require('../util/sql-database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  password: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = User;
