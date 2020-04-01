"use strict";

// Require modules.
const mongoose = require("mongoose");

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

    // Optional properties.
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },

    gender: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    dateOfBirth: {
        type: String,
        default: ""
    },
    organizationName: {
        type: String,
        default: ""
    },
    roleInOrganization: {
        type: String,
        default: ""
    }
});

// Create model based on userSchema using mongoose.
const User = mongoose.model("User", userSchema);

// Export.
exports.User = User;