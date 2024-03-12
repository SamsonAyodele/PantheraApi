const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("pantherastoredb", "root", "Nottimee01@", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
