const { Sequelize } = require('sequelize');

const db = new Sequelize('panelmgr', process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: 'mariadb',
    host: 'localhost',
    logging: false,
})

db.sync()

module.exports = db