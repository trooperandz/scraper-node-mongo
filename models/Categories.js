'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    category: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Categories = mongoose.model('Categories', CategoriesSchema);

module.exports = Categories;
