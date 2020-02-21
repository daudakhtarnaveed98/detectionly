'use strict';

// Require modules.
const mongoose = require('mongoose');

// Connect with database.
mongoose.connect('mongodb://localhost:27017/detectionly', {useNewUrlParser: true, useUnifiedTopology: true});