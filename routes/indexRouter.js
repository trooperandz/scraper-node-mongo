'use_strict';

const express = require('express');
const { renderIndexPage } = require('../controllers/indexController');
const router = express.Router();

// Load index page
router.get('/', renderIndexPage);

module.exports = router;
