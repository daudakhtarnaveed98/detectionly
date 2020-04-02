"use strict";

// Define constants.
// Status codes.
const statusCodes = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  "NOT FOUND": 404,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  "BAD REQUEST": 400,
  "NOT ACCEPTABLE": 406,
  "INTERNAL SERVER ERROR": 500,
});

// Export.
exports.statusCodes = statusCodes;
