"use strict";

// Require modules.
const models = require("../../../models");
const commons = require("../../../commons");
const utils = require("../../../utils");
const { hash } = require("bcryptjs");


// Function to send password reset email.
function sendPasswordResetEmail(detectionly) {
  detectionly.get("/forgot-password/:userEmailAddress", async function (req, res) {
    // Get user email address.
    const userEmailAddress = req.params["userEmailAddress"];

    // Send account activation email.
    const result = await utils.sendPasswordResetEmail(userEmailAddress);

    // If result is false, it means email address is wrong.
    if (result === false) {
      return res.status(404).send({
        statusCode: commons.statusCodes["NOT FOUND"],
        statusMessage: "NOT FOUND",
        responseMessage: "Invalid Email Address"
      });
    }

    // Else email sent successfully.
    return res.status(200).send({
      statusCode: commons.statusCodes.OK,
      statusMessage: "OK",
      responseMessage: "Password Reset Email Sent Successfully"
    });

  });
}

// Function to handle password reset token and redirection.
function handlePasswordResetTokenAndRedirection(detectionly) {
  detectionly.get("/reset-password/:passwordResetToken/:passwordResetTokenHash", async function (req, res) {
    // Get password reset token.
    const passwordResetToken = req.params["passwordResetToken"];
    const passwordResetTokenHash = req.params["passwordResetTokenHash"];

    // Find user with that password reset token.
    // Conditions to find user.
    const conditions = {
      passwordResetToken: passwordResetToken,
    };

    // Try to find user and return.
    let user = null;
    try {
      // Find user from database.
      user = await models.User.findOne(conditions).exec();
    } catch (error) {
      console.error(error);
    }

    // If user is not returned i.e. is null, redirect to sign-up page.
    if (user === null) {
      return res.redirect("http://localhost:65001/sign-up");
    }

    // Redirect to password reset page.
    return res.redirect("http://localhost:65001/reset-password/" + passwordResetToken + "/" + passwordResetTokenHash);
  });
}

// Function to update password.
function updateForgottenPassword(detectionly) {
  detectionly.post("/reset-password/:passwordResetToken", async function (req, res) {
    // Get password reset token.
    const passwordResetToken = req.params["passwordResetToken"];

    // Get new password.
    const {newPassword} = req.body;

    // Hash new password.
    const hashedNewPassword = await hash(newPassword, 12);

    // Update user with new password.
    try {
      await models.User.findOneAndUpdate(
        { passwordResetToken: passwordResetToken },
        { password: hashedNewPassword },
        { useFindAndModify: false, new: true }
      ).exec();
    } catch (error) {
      return res.redirect("http://localhost:65001/sign-up");
    }

    // Send success response.
    return res.status(200).send("Password update successful");
  });
}

// Export.
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.handlePasswordResetTokenAndRedirection = handlePasswordResetTokenAndRedirection;
exports.updateForgottenPassword = updateForgottenPassword;
