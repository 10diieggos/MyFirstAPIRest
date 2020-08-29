const Sequelize = require('sequelize');

const connection = new Sequelize('gamesshop', 'root', '123456', {
  host: '172.17.0.2', //this is a Docker container on default bridge network of Docker
  dialect: 'mysql'
});

module.exports = connection;