"use strict";

// Require modules.
const initializers = require("./initializer");
require("dotenv-expand")(require("dotenv").config());

// Initialize server.
initializers.initializeServer(process.env["SERVER_PORT"]);
