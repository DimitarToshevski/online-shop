const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-shop', 'root', '1234', {
  dialect: 'mysql',
  host: 'localhost',
  logging: false,
});

module.exports = sequelize;
