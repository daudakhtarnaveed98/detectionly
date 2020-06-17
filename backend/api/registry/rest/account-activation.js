"use strict";

// Require modules.
const models = require("../../../models");
const commons = require("../../../commons");
const utils = require("../../../utils");


// Function to activate account.
function activateAccount(detectionly) {
  detectionly.get("/activate/:activeToken", async function (req, res, next) {
    // Conditions to find user.
    const conditions = {
      activeToken: req.params.activeToken,
    };

    // Check if user exists in database and return boolean.
    try {
      // Find user from database.
      let result = null;
      try {
        result = await models.User.findOne(conditions).exec();
      } catch (error) {
        console.error(error);
      }

      // Invalid activation code.
      if (!result) {
        return res.json({
          statusCode: commons.statusCodes["BAD REQUEST"],
          statusMessage: "BAD REQUEST",
          responseMessage: "Invalid Activation Link"
        });
      }

      // Already activated user.
      if (result["active"] === true) {
        return res.redirect("http://localhost:65001/sign-in");
      }

      // Activate user.
      const update = {
        active: true
      };

      // Options.
      const options = {
        useFindAndModify: false,
        new: true,
      };

      // Update with activated field.
      try {
        await models.User.findOneAndUpdate(conditions, update, options).exec();
        return res.redirect("http://localhost:65001/sign-in");
      } catch (error) {
        console.error(error);
      }

      return next();
    } catch (error) {
      console.error(error);
    }
  });
}

// Function to send activation email.
function sendActivationEmail(detectionly) {
  detectionly.get("/account-activation/:userEmailAddress", async function (req, res, next) {
    // Get user email address.
    const userEmailAddress = req.params["userEmailAddress"];

    // Send account activation email.
    const result = await utils.sendActivationEmail(userEmailAddress);

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
      responseMessage: "Activation Email Sent Successfully"
    });

  });
}

// Export.
exports.activateAccount = activateAccount;
exports.sendActivationEmail = sendActivationEmail;
