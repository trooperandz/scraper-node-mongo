'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const PostsSchema = new Schema({
    post: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    _userRef: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: '_userRef is required',
    },

    _articleRef: {
        type: Schema.Types.ObjectId,
        ref: 'News',
        required: '_articleRef is required',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Posts = mongoose.model('Posts', PostsSchema);

module.exports = Posts;