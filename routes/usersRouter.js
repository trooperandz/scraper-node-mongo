'use strict';

const express = require('express'),
      usersController = require('../controllers/usersController'),
      router = express.Router();

router.get('/', usersController.loadSignupPage);
router.post('/add', usersController.insertUser);
router.post('/login', usersController.loginUser);

module.exports = router;