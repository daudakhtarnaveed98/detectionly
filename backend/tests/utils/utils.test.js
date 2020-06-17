"use strict";

// Require modules.
import {afterAll, beforeAll, describe, expect} from "@jest/globals";

const utils = require("../../utils");
const faker = require("faker");
const mongoose = require("mongoose");
const models = require("../../models");
const { hash } = require("bcryptjs");

// Global variables.
// Credentials to use for testing authenticateUser function.
let storedFakeUsersCredentials = [];

// Before all tests.
beforeAll(async () => {
  // Try to connect with database.
  try {
    await mongoose.connect("mongodb://localhost:27017/detectionly-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
  }

  // Insert some fake users in database.
  for (let i = 0; i < 3; i++) {
    const emailAddress = faker.internet.email();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    let password = faker.internet.password();

    // Append to storedFakeUsersCredentials array.
    storedFakeUsersCredentials.push({
      emailAddress: emailAddress,
      password: password,
    });

    // Hash password.
    try {
      password = await hash(password, 12);
    } catch (error) {
      console.log(error);
    }

    // Generate fake user.
    const fakeUser = new models.User({
      // Required properties.
      emailAddress: emailAddress,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    // Try to save user to database.
    try {
      await fakeUser.save();
    } catch (error) {
      console.log(error);
    }
  }
});

// After all tests.
afterAll(async () => {
  // Try to delete all users from database.
  try {
    await models.User.deleteMany({});
  } catch (error) {
    console.log(error);
  }

  // Try to disconnect connect from database.
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log(error);
  }

  // Delete storedFakeUsersCredentials.
  storedFakeUsersCredentials = null;
});

// Tests for checkIfUserRecordExistsInDatabase function.
describe("Function: checkIfUserRecordExistsInDatabase", () => {
  // Test with an existing user's email address as argument.
  test("[User Exists In Database]: Should return true", async () => {
    // Try to get existing users from database, extract email.
    let existingUsers = undefined;
    try {
      existingUsers = await models.User.find({});
    } catch (error) {
      console.log(error);
    }

    // If existingUsers is defined, extract email addresses of users and proceed.
    if (existingUsers) {
      const emailAddressesOfExistingUsers = existingUsers.map(
        (user) => user.emailAddress
      );

      for (let emailAddress of emailAddressesOfExistingUsers) {
        // Try to check if user record exists in database using utility function.
        let returnedBoolean = false;
        try {
          returnedBoolean = await utils.checkIfUserRecordExistsInDatabase(
            emailAddress
          );
        } catch (error) {
          console.log(error);
        }
        // Expect the returned boolean to be true.
        expect(returnedBoolean).toBeTruthy();
      }
    } else {
      console.error("Error: existingUsers is undefined");
    }
  });

  // Test with a non-existing user's email address as argument.
  test("[User Does Not Exist In Database]: Should return false", async () => {
    // Repeat for five times.
    for (let i = 0; i < 3; i++) {
      // Generate a new fake email address (non existent in database).
      const nonExistentEmailAddress = faker.internet.email();

      // Try to check if user record exists in database using utility function.
      let returnedBoolean = false;
      try {
        returnedBoolean = await utils.checkIfUserRecordExistsInDatabase(
          nonExistentEmailAddress
        );
      } catch (error) {
        console.log(error);
      }
      // Expect the returned boolean to be true.
      expect(returnedBoolean).toBeFalsy();
    }
  });
});

// Tests for getUserFromDatabase function.
describe("Function: getUserFromDatabase", () => {
  // Test with an existing user's email address as argument.
  test("[User Exists In Database]: Should be defined", async () => {
    // Try to get existing users from database, extract email.
    let existingUsers = undefined;
    try {
      existingUsers = await models.User.find({});
    } catch (error) {
      console.log(error);
    }

    // If existingUsers is defined, extract email addresses of users and proceed.
    if (existingUsers) {
      // Extract emails.
      const emailAddressesOfExistingUsers = existingUsers.map(
        (user) => user.emailAddress
      );

      // Loop.
      for (let emailAddress of emailAddressesOfExistingUsers) {
        // Try to get user record from database using utility function.
        let returnedObject = undefined;
        try {
          returnedObject = await utils.getUserFromDatabase(emailAddress);
        } catch (error) {
          console.log(error);
        }

        // Expect the returned object to be defined.
        expect(returnedObject).toBeDefined();
      }
    } else {
      console.error("Error: existingUsers is undefined");
    }
  });

  // Test with a non-existing user's email address as argument.
  test("[User Does Not Exist In Database]: Should return null", async () => {
    // Repeat for five times.
    for (let i = 0; i < 3; i++) {
      // Generate a new fake email address (non existent in database).
      const nonExistentEmailAddress = faker.internet.email();

      // Try to check if user record exists in database using utility function.
      let returnedObject = null;
      try {
        returnedObject = await utils.getUserFromDatabase(
          nonExistentEmailAddress
        );
      } catch (error) {
        console.log(error);
      }
      // Expect the returned boolean to be null.
      expect(returnedObject).toBeNull();
    }
  });
});

// Tests for saveUserToDatabase function.
describe("Function: saveUserToDatabase", () => {
  // Test with an correct user registration data.
  test("[Correct User Data]: Should return 201", async () => {
    for (let i = 0; i < 3; i++) {
      // Generate fake user data.
      const correctUserData = {
        emailAddress: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      // Try to save user in database.
      let response = null;
      try {
        response = await utils.saveUserToDatabase(correctUserData);
      } catch (error) {
        console.log(error);
      }

      // If response is not null.
      if (response) {
        // Expect response code to be 200.
        expect(response).toBe(201);
      } else {
        console.error("Error: response is null");
      }
    }
  });
});

// Tests for authenticateUser function.
describe("Function: authenticateUser", () => {
  // Test with an correct user signIn data.
  test("[Correct ForgotPassword Data]: Should return true", async () => {
    // Loop and authenticate each saved user.
    for (let userCredentials of storedFakeUsersCredentials) {
      let returnedBoolean = false;
      try {
        returnedBoolean = await utils.authenticateUser(
          userCredentials.emailAddress,
          userCredentials.password
        );
      } catch (error) {
        console.log(error);
      }

      // Expect returned boolean to be true.
      expect(returnedBoolean).toBeTruthy();
    }
  });

  // Test with an incorrect user signIn data.
  test("[Incorrect Email]: Should return false", async () => {
    // Loop and authenticate each saved user with invalid email.
    for (let userCredentials of storedFakeUsersCredentials) {
      let invalidEmailReturnValue = true;
      try {
        invalidEmailReturnValue = await utils.authenticateUser(
          faker.internet.email(),
          userCredentials.password
        );
      } catch (error) {
        console.log(error);
      }
      // Expect returned boolean to be true.
      expect(invalidEmailReturnValue).toBeFalsy();
    }

    // Loop and authenticate each saved user with invalid password.
    for (let userCredentials of storedFakeUsersCredentials) {
      let invalidPasswordReturnValue = true;
      try {
        invalidPasswordReturnValue = await utils.authenticateUser(
          userCredentials.emailAddress,
          faker.internet.password()
        );
      } catch (error) {
        console.log(error);
      }
      // Expect returned boolean to be true.
      expect(invalidPasswordReturnValue).toBeFalsy();
    }
  });
});

// Tests for checkIfAllUserRegistrationDataIsProvided function.
describe("Function: checkIfAllUserRegistrationDataIsProvided", () => {
  // Test with complete registration data.
  test("[Complete SignUp Data]: Should return true", async () => {
    let returnedBoolean = false;
    try {
      returnedBoolean = await utils.checkIfAllUserRegistrationDataIsProvided({
        emailAddress: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      });
    } catch (error) {
      console.error(error);
    }
    expect(returnedBoolean).toBeTruthy();
  });

  // Test with incomplete registration data.
  test("[Incomplete SignUp Data]: Should return false", async () => {
    const incompleteInputDataArray = [
      {
        emailAddress: "",
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
      {
        emailAddress: faker.internet.email(),
        password: "",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
      {
        emailAddress: faker.internet.email(),
        password: faker.internet.password(),
        firstName: "",
        lastName: faker.name.lastName(),
      },
      {
        emailAddress: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: "",
      },
      {
        emailAddress: "",
        password: "",
        firstName: "",
        lastName: "",
      },
      {
        emailAddress: null,
        password: null,
        firstName: null,
        lastName: null,
      },
    ];

    for (let incompleteInputData of incompleteInputDataArray) {
      let returnedBoolean = true;
      try {
        returnedBoolean = await utils.checkIfAllUserRegistrationDataIsProvided(
          incompleteInputData
        );
      } catch (error) {
        console.error(error);
      }
      expect(returnedBoolean).toBeFalsy();
    }
  });
});

// Tests for concatenateSchemas function.
describe("Function: concatenateSchemas", () => {
  // Test with two schema inputs.
  test("[Two Schema Input]: Should return schemaOne and schemaTwo concatenated", async () => {
    const schemaOne = `
            input UserRegistrationInput {
            emailAddress: String!
            password: String!
            firstName: String!
            lastName: String!
        }`;

    const schemaTwo = `
        type Mutation {
            registerUser(userRegistrationData: UserRegistrationInput): Response!
            updateUserInformation(userEmailAddress: String!, updatedInformation: UserInformationUpdateInput): Response!
            updateUserPassword(userEmailAddress: String!, userUpdatePasswordData: UserPasswordUpdateInput): Response!
            deleteUserAccount(userEmailAddress: String!, password: String!): Response!
        }`;

    let concatenatedSchema = "";
    try {
      concatenatedSchema = await utils.concatenateSchemas(schemaOne, schemaTwo);
    } catch (error) {
      console.error(error);
    }
    expect(concatenatedSchema).toBe(schemaTwo + schemaOne);
  });

  // Test with four schema inputs.
  test("[Four Schema Input]: Should return schemaOne, schemaTwo schemaThee and schemaFour concatenated", async () => {
    const schemaOne = `
        type Query {
            loginUser(userLoginData: UserLoginInput): AuthenticationData!
        }`;

    const schemaTwo = `
        type Response {
            statusCode: Int!
            statusMessage: String!
            responseMessage: String!
        }`;

    const schemaThree = `
        type schema {
            query: Query
            mutation: Mutation
        }`;

    const schemaFour = `
        input UserPasswordUpdateInput {
            currentPassword: String!
            newPassword: String!
        }`;

    let concatenatedSchema = "";
    try {
      concatenatedSchema = await utils.concatenateSchemas(
        schemaOne,
        schemaTwo,
        schemaThree,
        schemaFour
      );
    } catch (error) {
      console.error(error);
    }
    expect(concatenatedSchema).toBe(
      schemaFour + schemaThree + schemaTwo + schemaOne
    );
  });
});
