const Sequelize = require('sequelize');

const connection = new Sequelize('gameshop', 'root', '123456', {
  host: 'db', //this is a Docker container on default bridge network of Docker
  dialect: 'mysql',
  timezone: '-03:00'
});

module.exports = connection;