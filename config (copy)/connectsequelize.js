
const Sequelize = require('sequelize')


const sequelize = new Sequelize('ipayed', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases:false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

module.exports=sequelize;