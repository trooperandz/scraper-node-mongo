'use_strict';

const express = require('express'),
      adminController = require('../controllers/adminController'),
      router = express.Router();

// Load index page
router.get('/', adminController.renderAdminPage);

module.exports = router;
