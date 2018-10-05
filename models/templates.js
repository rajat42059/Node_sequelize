module.exports = function(sequelize, Sequelize) {
 
    var template = sequelize.define('email_templates', {
 
        template_id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
      
        template_name: {
            type: Sequelize.STRING,
            notEmpty: true
        }, 
        template_html: {
            type: Sequelize.STRING
        },
        template_subject: {
            type: Sequelize.STRING
        },
 
 
    }, {
        timestamps: false
    }
);
 
    return template;
 
}
