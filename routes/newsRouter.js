'use strict';

const express = require('express'),
      newsController = require('../controllers/newsController'),
      router = express.Router();

router.get('/add', newsController.insertNews);
router.get('/view', newsController.viewNews);
router.get('/remove', newsController.removeNews);

module.exports = router;
