"use strict";

// Require modules.
const accountActivator = require("./account-activation");
const forgotPassword = require("./forgot-password");

// Export.
exports.activateAccount = accountActivator.activateAccount;
exports.sendActivationEmail = accountActivator.sendActivationEmail;
exports.sendPasswordResetEmail= forgotPassword.sendPasswordResetEmail;
exports.handlePasswordResetTokenAndRedirection = forgotPassword.handlePasswordResetTokenAndRedirection;
exports.updateForgottenPassword = forgotPassword.updateForgottenPassword;
