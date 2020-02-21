'use strict';

// Require modules.
const utils = require('../../utils');
const faker = require('faker');

// Tests for checkIfAllUserRegistrationDataIsProvided function.
describe('Function: checkIfAllUserRegistrationDataIsProvided', () => {
    // Test with complete registration data.
    test('[Complete Registration Data]: Should return true', async () => {
        const returnedBoolean = await utils.checkIfAllUserRegistrationDataIsProvided(
            {
                "emailAddress": faker.internet.email(), "password": faker.internet.password(), "firstName": faker.name.firstName(), "lastName": faker.name.lastName()
            }
        );
        expect(returnedBoolean).toBeTruthy();
    });

    // Test with incomplete registration data.
    test('[Incomplete Registration Data]: Should return false', async () => {
        const incompleteInputDataArray = [
            {
                "emailAddress": "", "password": faker.internet.password(), "firstName": faker.name.firstName(), "lastName": faker.name.lastName()
            },
            {
                "emailAddress": faker.internet.email(), "password": "", "firstName": faker.name.firstName(), "lastName": faker.name.lastName()
            },
            {
                "emailAddress": faker.internet.email(), "password": faker.internet.password(), "firstName": "", "lastName": faker.name.lastName()
            },
            {
                "emailAddress": faker.internet.email(), "password": faker.internet.password(), "firstName": faker.name.firstName(), "lastName": ""
            },
            {
                "emailAddress": "", "password": "", "firstName": "", "lastName": ""
            },
            {
                "emailAddress": null, "password": null, "firstName": null, "lastName": null
            },
        ];

        for (let incompleteInputData of incompleteInputDataArray) {
            const returnedBoolean = await utils.checkIfAllUserRegistrationDataIsProvided(incompleteInputData);
            expect(returnedBoolean).toBeFalsy();
        }
    });
});

// Tests for concatenateSchemas function.
describe('Function: concatenateSchemas', () => {
    // Test with two schema inputs.
    test('[Two Schema Input]: Should return schemaOne and schemaTwo concatenated', async () => {
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

        const concatenatedSchema = await utils.concatenateSchemas(
            schemaOne, schemaTwo
        );
        expect(concatenatedSchema).toBe(schemaTwo + schemaOne);
    });

    // Test with four schema inputs.
    test('[Four Schema Input]: Should return schemaOne, schemaTwo schemaThee and schemaFour concatenated', async () => {
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

        const concatenatedSchema = await utils.concatenateSchemas(
            schemaOne, schemaTwo, schemaThree, schemaFour
        );
        expect(concatenatedSchema).toBe(schemaFour + schemaThree + schemaTwo + schemaOne);
    });
});