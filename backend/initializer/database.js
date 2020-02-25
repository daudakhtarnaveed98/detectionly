"use strict";

// Require modules.
const mongoose = require("mongoose");
require("dotenv").config();

// Function to connect with database.
async function connectWithMongoDB() {
    // Database connect uri from env values.
    const databaseURI = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME;

    // Try to to connect with database.
    try {
        await mongoose.connect(databaseURI, {useNewUrlParser: true, useUnifiedTopology: true});
    } catch (error) {
        console.error(error);
    }
}

// Export.
exports.connectWithMongoDB = connectWithMongoDB;