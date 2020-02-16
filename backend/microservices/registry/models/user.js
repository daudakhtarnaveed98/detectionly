'use strict';

// Require modules.
const mongoose = require('mongoose');

// Create schema constructor from mongoose.
const Schema = mongoose.Schema;

// Create user schema for mongoose.
const userSchema = new Schema({
    // Required properties.
    emailAddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    // Optional properties.
    gender: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    organizationName: {
        type: String
    },
    roleInOrganization: {
        type: String
    }
});

// Create model using mongoose.
exports.User = mongoose.model('User', userSchema);