'use strict';

const services = require('../services');

module.exports = {
    renderAdminPage: (req, res) => {
        res.render('admin', { userName: req.session.userName });
    },
}