const Sequelize = require('sequelize');

const sequelize = new Sequelize('shop', 'root', 'Password1!', {
  dialect: 'mysql',
  host: 'node-shop.cpwu0y8zcyah.eu-central-1.rds.amazonaws.com',
  logging: false,
});

module.exports = sequelize;
