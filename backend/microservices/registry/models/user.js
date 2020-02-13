// Requiring modules.
const mongoose = require('mongoose');

// Create schema constructor from mongoose.
const Schema = mongoose.Schema;

// Create schema for user.
const userSchema = new Schema({
    // Required properties.
    userName: {
        type: String,
        required: true
    },
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

// Create model using mongoose and export it.
exports = mongoose.model('User', userSchema);