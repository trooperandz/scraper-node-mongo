'use strict';

const express = require('express');
const router = express.Router();

const {
  loadSignupPage,
  insertUser,
  renderProfile,
  loginUser,
  logoutUser,
} = require('../controllers/usersController'),

router.get('/', loadSignupPage);
router.post('/add', insertUser);
router.get('/profile', renderProfile);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

module.exports = router;