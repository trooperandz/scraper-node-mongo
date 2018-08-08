'use strict';

// Load Modules
const Passwords = require('machinepack-passwords');
const moment = require('moment');

const Users = require('../models/Users');
const services = require('../services');

// Set globals
const validEmail = /(^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$)|(^N\/A$)/;
const validPass = /^(?=.*\d)(?=.*[@#\-_$%^&+=§!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!\?]{8,}$/;
const loginFailMsg = 'Your username or password is incorrect!';

function renderLoginPage(req, res, error, userName, password) {
    return res.render('index', {
        error,
        userName,
        password,
    });
}

function renderSignUpPage(req, res, errors, firstName, lastName, userName, email, password, successMsg) {
    return res.render('signup', {
        errors,
        firstName,
        lastName,
        userName,
        email,
        password,
        successMsg,
    });
}

module.exports = {
    // Render the sign up page
    loadSignupPage: (req, res) => {
        req.session.hasAppLoaded = true;
        renderSignUpPage(req, res);
    },

    // Process user login
    loginUser: (req, res) => {
        let userName = req.body.userName;
        let password = req.body.password;

        // Find user
        Users.find({ 'userName': userName }, (err, user) => {
            if (err) {
                return res.send('Query error occurred!');
            } else {
                if (user.length == 0) {
                    renderLoginPage(req, res, loginFailMsg, userName, password);
                } else if (user.length > 1) {
                    renderLoginPage(req, res, 'Duplicate user error!', userName, password);
                } else {
                    // User found. Verify password
                    Passwords.checkPassword({
                        passwordAttempt: password,
                        encryptedPassword: user[0].password,
                    }).exec({
                        // An unexpected error occurred.
                        error: (err) => {
                            renderLoginPage(req, res, 'Unexpected password encryption error!', userName, password);
                        },
                        // Password attempt does not match already-encrypted version
                        incorrect: () => {
                            renderLoginPage(req, res, loginFailMsg, userName, password);
                        },
                        success: () => {
                            // Password verified
                            req.session.authenticated = true;
                            req.session.userId = user[0]._id;
                            req.session.firstName = user[0].firstName,
                            req.session.lastName = user[0].lastName,
                            req.session.userName = user[0].userName;
                            req.session.userEmail = user[0].email;
                            req.session.createdAt = user[0].createdAt;
                            console.log('session data: userId: ' + req.session.userId + 'userName: ' + req.session.userName);
                            console.log('user login data obj: ', user);
                            res.redirect('/news/view');
                        }
                    });
                }
            }
        });
    },

    // Log out current user
    logoutUser: (req, res) => {
        // Remove session data
        req.session.destroy((err) => {
            if (err) {
                res.send('error: ' + err);
            } else {
                res.redirect('/');
            }
        });
    },

    // Show user's profile info
    renderProfile: (req, res) => {
        res.render('profile', {
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            userName: req.session.userName,
            userEmail: req.session.userEmail,
            createdAt: moment(new Date(req.session.createdAt)).format('MM/DD/YYYY'),
        });
    },

    // Add new user to db from sign up page
    insertUser: (req, res) => {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let userName = req.body.userName;
        let email = req.body.email;
        let password = req.body.password;

        let errorArr = [];

        // Validate inputs
        if (firstName == '') {
            errorArr.push('Please enter a valid first name.');
        }
        if (lastName == '') {
            errorArr.push('Please enter a valid last name.');
        }
        if (!validEmail.test(email)) {
            errorArr.push('You entered an invalid email address!');
        }
        if (!validPass.test(password)) {
            errorArr.push('You entered an invalid password!');
        }

        if (errorArr.length > 0) {
            return renderSignUpPage(req, res, errorArr, firstName, lastName, userName, email, password);
        }

        // Encrypt password
        Passwords.encryptPassword({password}).exec({
            error: (err) => {
                errorArr.push("There was a password encryption error!");
                return renderSignUpPage(req, res, errorArr, firstName, lastName, userName, email, password);
            },
            success: function(encryptedPassword) {
                // First, check for errorArr to ensure that invalid data is not inserted into db
                if(errorArr.length > 0) {
                    return renderSignUpPage(req, res, errorArr, firstName, lastName, userName, email, password);
                }
                // No errors; add new user to db
                let user = new Users({
                    firstName,
                    lastName,
                    userName,
                    email,
                    password: encryptedPassword,
                });
                user.save((err, doc) => {
                    if (err) {
                        return renderSignUpPage(req, res, errorArr, firstName, lastName, userName, email, password);
                    }
                    // Saved to db successfully
                    let successMsg = 'You have signed up successfully! \n An email confirmation has been sent to: ' + email;
                    return renderSignUpPage(req, res, errorArr, firstName, lastName, userName, email, password, successMsg);
                });
            }
        });
    },
}