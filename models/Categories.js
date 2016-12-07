'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Categories = mongoose.model('Categories', UsersSchema);

module.exports = Categories;
