'use strict';

const express = require('express'),
      usersController = require('../controllers/usersController'),
      router = express.Router();

router.get('/', usersController.renderSignupPage);
router.post('/add', usersController.insertUser);
router.post('/login', usersController.loginUser);

module.exports = router;