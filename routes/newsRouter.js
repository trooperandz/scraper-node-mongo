'use strict';

const express = require('express'),
      newsController = require('../controllers/newsController'),
      router = express.Router();

router.get('/add', newsController.insertNews);
router.get('/view', newsController.viewNews);
router.get('/view/:id', newsController.viewArticle);
router.post('/remove', newsController.removeNews);

module.exports = router;
