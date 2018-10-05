var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var session = require("express-session");
var models = require("./models");
require('dotenv').config();

var passport = require('passport')

const brcypt = require("bcryptjs");
var jwt=require('jsonwebtoken');
var multer = require("multer");

var app = express();
const Sequelize = require('sequelize')


// config.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

models.sequelize.sync().then(function() {
 
  console.log('Db connected')

}).catch(function(err) {

  (err, "Something went wrong with the Database Update!")

});

  app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions


// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);





app.get("*", function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


var users = require("./routes/users");
app.use("/api/v1", users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found.");
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler

if (app.get("env") === "development") {
  app.use((error, req, res, next)=> {
    res.status(error.status || 500);
    res.json({
        message: error.message,
        
    });
  });
}

// production error handler
app.use((error, req, res, next)=> {
  res.status(error.status || 500);
  res.json({
      message: error.message,
      
  });
});

var port = process.env.port || 5000;
var serve = app.listen(port, () => console.log(port));

module.exports = app;
