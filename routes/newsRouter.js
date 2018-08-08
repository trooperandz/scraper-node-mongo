'use strict';

const express = require('express');
const router = express.Router();

const {
  insertNews,
  viewNews,
  viewArticle,
  postComment,
  removeComment,
  removeNews,
} = require('../controllers/newsController');

router.get('/add', insertNews);
router.get('/view', viewNews);
router.get('/view/:id', viewArticle);
router.post('/comment', postComment);
router.post('/removeComment', removeComment);
router.get('/remove', removeNews);

module.exports = router;
