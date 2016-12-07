'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const NewsSchema = new Schema({
    heading: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    link: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    description: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    imgUrl: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const News = mongoose.model('News', NewsSchema);

module.exports = News;
