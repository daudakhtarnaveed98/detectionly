"use strict";

// Require modules.
const jsonwebtoken = require("jsonwebtoken");
require("dotenv-expand")(require("dotenv").config());

// Function to authenticate incoming request.
function authenticateRequest(req, res, next) {
  // Get authorization header from request.
  const authorizationHeader = req.get("Authorization");

  // If authorization header is not present, set req.isAuthorized to false.
  if (!authorizationHeader) {
    req.isAuthorized = false;
    return next();
  }

  // Get json web token (jwt) from authorization header.
  const jwt = req.headers["authorization"].split(" ")[1];

  // If jwt is not present or jwt is empty string, set req.isAuthorized to false.
  if (!jwt || jwt === "") {
    req.isAuthorized = false;
    return next();
  }

  // Try to verify jwt.
  let decodedValues;
  try {
    decodedValues = jsonwebtoken.verify(jwt, process.env["PRIVATE_KEY"]);
  } catch (error) {
    req.isAuthorized = false;
    return next();
  }

  // If decodedValues is not present or, set req.isAuthorized to false.
  if (!decodedValues) {
    req.isAuthorized = false;
    return next();
  }

  // Set req.isAuthorized to true.
  req.isAuthorized = true;
  req.emailAddress = decodedValues.emailAddress;
  next();
}

// Export.
exports.authenticateRequest = authenticateRequest;
