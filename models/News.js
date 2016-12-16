'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const NewsSchema = new Schema({
    heading: {
        type: String,
        unique: true,
        trim: true,
        required: 'String is required',
    },

    link: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    articleDate: {
        type: Date,
        required: 'Date is required',
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

    _categoryRef: {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Posts',
    }],
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;
