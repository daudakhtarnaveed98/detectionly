'use strict';

// Require modules.
const mongoose = require('mongoose');

// Try to connect with database.
try {
    mongoose.connect('mongodb://localhost:27017/detectionly', {useNewUrlParser: true, useUnifiedTopology: true});
} catch (error) {
    console.log(error);
}