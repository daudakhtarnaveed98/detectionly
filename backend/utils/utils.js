"use strict";

// Require modules.
const models = require("../models");
const commons = require("../commons");
const { compare } = require("bcryptjs");
const md5 = require("md5");
const uuid = require("uuid");
const { transporter } = require("./mailer");

// Utility functions.
// Function to check if user record exists in database.
async function checkIfUserRecordExistsInDatabase(userEmailAddress) {
  // Conditions to find user.
  const conditions = {
    emailAddress: userEmailAddress,
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

    return result != null;
  } catch (error) {
    // Catch and log error.
    console.error(error);
  }
}

// Function to get a user from database.
async function getUserFromDatabase(userEmailAddress) {
  // Try to check if user record exists in database.
  let doesUserRecordExist = false;
  try {
    doesUserRecordExist = await checkIfUserRecordExistsInDatabase(
      userEmailAddress
    );
  } catch (error) {
    console.error(error);
  }

  // If doesUserRecordExist is true, get and return user.
  if (doesUserRecordExist) {
    // Conditions to find user.
    const conditions = {
      emailAddress: userEmailAddress,
    };

    // Try to find user and return.
    try {
      // Find user from database.
      return await models.User.findOne(conditions).exec();
    } catch (error) {
      // Catch and log error.
      console.error(error);
    }
  } else {
    return null;
  }
}

// Function to check if required data for user registration is provided.
async function checkIfAllUserRegistrationDataIsProvided(userRegistrationData) {
  for (let key of Object.keys(userRegistrationData)) {
    // Return false if any key is null or empty string.
    if (userRegistrationData[key] == null || userRegistrationData[key] === "") {
      return false;
    }
  }
  // Return true in case of loop completion.
  return true;
}

// Function to save a user into database with provided user registration data.
async function saveUserToDatabase(userRegistrationData) {
  // Create user to save based on User model.
  const userToSave = new models.User({
    // Required properties.
    emailAddress: userRegistrationData.emailAddress,
    password: userRegistrationData.password,
  });


  // Set activation token for user.
  userToSave.activeToken = userToSave._id;

  // Construct activation link with activation token.
  const link = 'http://localhost:65000/activate/' + userToSave.activeToken;

  // Try to save user to database.
  try {
    await userToSave.save();

    // Send activation email.
    await transporter.sendMail({
      from: '"Detectionly" <detectionly@gmail.com>',
      to: userRegistrationData.emailAddress,
      text: "Account Activation",
      subject: 'Welcome to Detectionly',
      html: 'Please click <a href="' + link + '"> here </a> to activate your account.'
    });

    return commons.statusCodes["CREATED"];
  } catch (error) {
    // Catch and log error.
    console.error(error);
  }
}

// Function to fetch a user from database, extract and compare password and return true if passwords match.
async function authenticateUser(userEmailAddress, password) {
  // Try to fetch user object and then extract old password from it.
  let userFromDatabase = null;
  try {
    userFromDatabase = await getUserFromDatabase(userEmailAddress);
  } catch (error) {
    console.error(error);
  }

  if (userFromDatabase != null) {
    // Extract password.
    const { password: userCurrentPassword } = userFromDatabase;

    // Compare passwords.
    try {
      return await compare(password, userCurrentPassword);
    } catch (error) {
      console.error(error);
    }
  } else {
    return false;
  }
}

// Function to check if account is activated.
async function isActivated(userEmailAddress) {
  // Try to fetch user object and then check if it is activated.
  let userFromDatabase = null;
  try {
    userFromDatabase = await getUserFromDatabase(userEmailAddress);
  } catch (error) {
    console.error(error);
  }

  return userFromDatabase["active"] === true;
}

// Function to send activation email.
async function sendActivationEmail(userEmailAddress) {
  // Get user from database.
  const user = await getUserFromDatabase(userEmailAddress);

  if (user === null) {
    return false;
  }

  // Set activation token for user.
  user.activeToken = user._id;

  // Construct activation link with activation token.
  const link = 'http://localhost:65000/activate/' + user.activeToken;

  // Send activation email.
  await transporter.sendMail({
    from: '"Detectionly" <detectionly@gmail.com>',
    to: userEmailAddress,
    text: "Account Activation",
    subject: 'Welcome to Detectionly',
    html: 'Please click <a href="' + link + '"> here </a> to activate your account.'
  });

  return true;
}

// Function to send password reset email.
async function sendPasswordResetEmail(userEmailAddress) {
  // Password reset token.
  const passwordResetToken = uuid.v4();
  const passwordResetTokenHash = md5(passwordResetToken);

  // Conditions to find user.
  const conditions = {
    emailAddress: userEmailAddress,
  };

  // Set password reset token for user.
  const update = {
    passwordResetToken: passwordResetToken,
  };

  // Options.
  const options = {
    useFindAndModify: false,
    new: true,
  };

  // Update with activated field.
  try {
    const result = await models.User.findOneAndUpdate(conditions, update, options).exec();
    if (result === null) {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }

  // Construct activation link with password reset token.
  const link = 'http://localhost:65000/reset-password/' + passwordResetToken + "/" + passwordResetTokenHash;

  // Send activation email.
  await transporter.sendMail({
    from: '"Detectionly" <detectionly@gmail.com>',
    to: userEmailAddress,
    text: "Password Reset",
    subject: 'Password Reset Request',
    html: 'Please click <a href="' + link + '"> here </a> to reset your account password.'
  });

  return true;
}

// Function to concatenate schemas.
function concatenateSchemas(...schemasToCombine) {
  // Variable to hold concatenated schemas.
  let concatenatedSchemas = "";

  // Loop and concatenate.
  for (const schema of schemasToCombine) {
    concatenatedSchemas = schema + concatenatedSchemas;
  }

  // Return concatenated schema.
  return concatenatedSchemas;
}

// Export.
exports.checkIfUserRecordExistsInDatabase = checkIfUserRecordExistsInDatabase;
exports.getUserFromDatabase = getUserFromDatabase;
exports.checkIfAllUserRegistrationDataIsProvided = checkIfAllUserRegistrationDataIsProvided;
exports.saveUserToDatabase = saveUserToDatabase;
exports.authenticateUser = authenticateUser;
exports.concatenateSchemas = concatenateSchemas;
exports.isActivated = isActivated;
exports.sendActivationEmail = sendActivationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
