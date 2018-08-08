'use_strict';

const express = require('express');
const { renderAdminPage } = require('../controllers/adminController');
const router = express.Router();

// Load index page
router.get('/', renderAdminPage);

module.exports = router;
