"use strict";

// Require modules.
const nodeMailer = require("nodemailer");
require("dotenv-expand")(require("dotenv").config());

// Configuration
const config = {
  host: process.env["WM_HOST"],
  port: parseInt(process.env["WM_PORT"]),
  auth: {
    user: process.env["WM_USER"],
    pass: process.env["WM_PASS"]
  }
};

// Create transporter.
const transporter = nodeMailer.createTransport(config);

// Export.
exports.transporter = transporter;
