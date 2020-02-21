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
        type: String,
        default: null
    },
    phoneNumber: {
        type: String,
        default: null
    },
    dateOfBirth: {
        type: String,
        default: null
    },
    organizationName: {
        type: String,
        default: null
    },
    roleInOrganization: {
        type: String,
        default: null
    }
});

// Create model based on userSchema using mongoose.
const User = mongoose.model('User', userSchema);

// Export.
exports.User = User;