'use strict';

// Require modules.
const mongoose = require('mongoose');

// Database details.
const MONGO_USERNAME = '';
const MONGO_PASSWORD = '';
const MONGO_HOSTNAME = '';
const MONGO_PORT = '';
const MONGO_DB = '';

// Connect with database.
mongoose.connect('mongodb://localhost:27017/detectionly', {useNewUrlParser: true, useUnifiedTopology: true});