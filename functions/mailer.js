const async = require("async");
const nodemailer = require("nodemailer");
var model = require('../models');
var sequelize = require('sequelize');


function templateEmailer(template_name, data, callback_main) {
    async.waterfall([
        function (callback) {

            model.email_templates.findOne({
                where: {
                    template_name: template_name,
                }
            }).then((emailTemplateData) => {

                callback(null, emailTemplateData);
            })
            //.catch((err)=>{
            //     callback(err)
            // })


        },
        function (emailTemplateData, callback) {

            model.sequelize.query('SELECT * FROM config', {
                bind: ['active'],
                type: sequelize.QueryTypes.SELECT
            }).then(configSettings => {
                callback(null, emailTemplateData, configSettings);
            })


        }
    ], function (err, emailTemplateData, configSettings) {

        if (err) {
            callback_main("Template doesn't exist!!!");
        } else {


            const smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: configSettings[0].nodemailer_auth_email,
                    pass: configSettings[0].nodemailer_auth_pass
                }
            });



            let mailOptions = {
                from: configSettings[0].nodemailer_auth_email, // sender address
                to: data.to_email, // list of receivers
                subject: template_name, // Subject line 
                html: emailTemplateData.template_html

            };
            smtpTransport.sendMail(mailOptions, function (err, info) {

                if (err) {

                    console.log('test')
                    callback_main(err)
                }


                model.user.update({
                        email_verification_token: data.email_verification_token
                    }, {
                        where: {
                            user_email: data.to_email
                        }
                    })
                    .then(result =>
                        console.log(result)
                    )
                    .catch(err =>
                        handleError(err)
                    )



                callback_main(err, info);
            });



        }
    });
}

exports.templateEmailer = templateEmailer;