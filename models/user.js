module.exports = function(sequelize, Sequelize) {
 
    var User = sequelize.define('user', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
      
        user_name: {
            type: Sequelize.STRING,
            notEmpty: true
        }, 
        user_city: {
            type: Sequelize.STRING
        },
        user_state: {
            type: Sequelize.STRING
        },
 
        user_email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        }, 
        user_password: {
            type: Sequelize.STRING,
            allowNull: false
            // validate: {
            //     len: {
            //         args: 8,
            //         msg: "Name must be atleast 8 characters in length"
            //     }
            // }
        },
 
        last_login: {
            type: Sequelize.DATE
        },
 
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        reset_password_token: {
            type: Sequelize.STRING
        },
        
        email_verification_token: {
            type: Sequelize.STRING
        },
 
 
    });
 
    return User;
 
}
