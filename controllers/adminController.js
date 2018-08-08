'use strict';

const services = require('../services');

module.exports = {
    renderAdminPage: (req, res) => {
        req.session.hasAppLoaded = true;
        res.render('admin', { userName: req.session.userName });
    },
}