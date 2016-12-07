'use strict';

const mongoose = require('mongoose'),
      News = require('../models/News');

module.exports = {
    insertNews: (obj) => {
        let record = new News(obj);
        /*
        record.save(err, doc) => {
            if(err) {
                console.log(err);
            } else {
                console.log(doc);
            }
        }*/
    }
}