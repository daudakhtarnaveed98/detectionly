"use strict";

// Require modules.
const mongoose = require("mongoose");
require('dotenv-expand')(require('dotenv').config());

// Function to connect with database.
async function connectWithMongoDB() {
    // Database connect uri from env values.
    const databaseURI = process.env.DB_URI;

    // Try to to connect with database.
    try {
        await mongoose.connect(databaseURI, {useNewUrlParser: true, useUnifiedTopology: true});
    } catch (error) {
        console.error(error);
    }
}

// Export.
exports.connectWithMongoDB = connectWithMongoDB;