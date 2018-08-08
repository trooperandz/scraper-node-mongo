'use strict';

const express = require('express'),
      usersController = require('../controllers/usersController'),
      router = express.Router();

router.get('/', usersController.loadSignupPage);
router.post('/add', usersController.insertUser);
router.get('/profile', usersController.renderProfile);
router.post('/login', usersController.loginUser);
router.get('/logout', usersController.logoutUser);

module.exports = router;