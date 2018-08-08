'use strict';

const services = require('../services');

module.exports = {
    renderIndexPage: (req, res) => {
        if (!req.session.hasAppLoaded) return res.redirect('/news/view');

        return res.render('index');
    },
}