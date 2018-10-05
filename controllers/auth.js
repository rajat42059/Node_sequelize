const bCrypt = require('bcryptjs')
var crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var model = require('../models');
const async = require("async");
const mailer = require("../functions/mailer");

exports.login = (req, res, next) => {


}


// Local Strategy

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function (req, email, password, done) { // callback with email and password from our form


    model.user.findOne({
      where: {
        user_email: email,
        //  email_verification_token:null
      }
    }).then((user) => {

      if (!user) {

        return done(null, false, {
          message: 'Email do not exists'
        });
      }

      var newpass = req.body.password;
      var db_password = user.user_password;
      var emailtoken = user.email_verification_token;
      bCrypt.compare(newpass, db_password, function (err, ress) {

        if (!ress) {

          return done(null, false, {
            message: 'Incorrect password.'
          });

        } else {
          if (emailtoken) {
            return done(null, false, {
              message: 'Please verify email first'
            });
          }



          return done(null, user);
        }
      });

    })


  }));





exports.signup = (req, res, next) => {

  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var city = req.body.city;
  var state = req.body.state;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    res.json({
      message: errors,
    });
  } else {
    model.user.findOne({
      where: {
        user_email: email
      }
    }).then(function (user) {//if user found

      if (user) {

       return res.json({
          error: 'Email already exists'
        });
      }

      bCrypt.hash(password, 10).then(function (userPassword) { //encrypting password

        model.user.create({
          user_email: email,
          user_password: userPassword,
          user_name: name,
          user_city: city,
          user_state: state
        }, function (error, user) {

          if (error) {
            res.json({
              err: error
            });

          }

        }).then((user) => {
          var email = user.user_email         

          async.waterfall([
            function (callback) {
        
              crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
        
                mailer.templateEmailer("welcome_user", {
                  to_email: email,
                  email_verification_token: token,
                  user_name: email || "there",
                  bcc_email: "rajat.gupta@mobileprogramming.net"
                }, function (err, info) {
                  if (err) {
        
                    console.log(err)
        
                  }
                });
        
        
              });        
        
        
            }
        
          ]);




          res.json({
            email: user.user_email,
            message: 'Users Successfully registered.Verification E mail has been sent to your email Id please verify to login',
            status: 'success'

          });

        })

      });

    })

  }



}

