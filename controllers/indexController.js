'use strict';

const services = require('../services');

module.exports = {
    loadIndexPage: (req, res) => {
        res.render('index', { title: 'Welcome To ScrapeInator, Where News Is Scraped Daily'  });
    }
}