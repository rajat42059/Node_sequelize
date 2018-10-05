const Sequelize = require('sequelize');
 



module.exports = (sequelize, type) => {
    return sequelize.define('users_login', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,
        email: type.STRING,
        city: type.STRING,
        name: type.STRING,
        password: type.STRING,

    })


  
}

