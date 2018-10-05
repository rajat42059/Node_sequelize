var express = require('express');
var router = express.Router();
const RegisterController = require('../controllers/auth');
var model = require('../models/index');
const passport = require('passport');

var jwt = require('jsonwebtoken');
router.get("/signup", (req, res) => {

    res.json({
        message: 'testme',

    });
});


router.post('/users/login', function (req, res, next) {


    req.checkBody('email', 'Name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        res.json({
            err: errors
        });
    }

    passport.authenticate('local-login', function (err, user, info) {

            const token = jwt.sign({
                    id: user.id,
                    email: user.user_email
                },
                process.env.SECRET_KEY, {
                    expiresIn: "10h"
                }
            );


            if (user) {
                res.json({
                    data: user.user_email,
                    token: token,
                    message: 'Sucessfully Login',
                    status: 'success'
                });
            } else {
                res.json({
                    error: info

                });
            }

        }


    )(req, res, next);
});




/* Signup controller */

router.post('/users', RegisterController.signup);




/* update todo. */
router.put('/:id', function (req, res, next) {

});


/* GET todo listing. */
router.delete('/:id', function (req, res, next) {

});



module.exports = router;
