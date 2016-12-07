'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const UsersSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    lastName: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    userName: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    email: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    password: {
        type: String,
        trim: true,
        required: 'String is required',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
