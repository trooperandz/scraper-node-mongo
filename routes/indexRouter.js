'use_strict';

const express = require('express'),
      indexController = require('../controllers/indexController'),
      router = express.Router();

// Load index page
router.get('/', indexController.renderIndexPage);

module.exports = router;
