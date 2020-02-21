'use strict';

// Require modules.
const utils = require('../../utils');

// Tests for checkIfAllUserRegistrationDataIsProvided function.
describe('Function: checkIfAllUserRegistrationDataIsProvided', () => {
    // Test with complete registration data.
    test('[Complete Registration Data]: Should return true', async () => {
        const returnedBoolean = await utils.checkIfAllUserRegistrationDataIsProvided(
            {
                "emailAddress": "demo@demo.com",
                "password": "demo",
                "firstName": "demo",
                "lastName": "demo"
            }
        );
        expect(returnedBoolean).toBeTruthy();
    });

    // Test with incomplete registration data.
    test('[Incomplete Registration Data]: Should return false', async () => {
        const incompleteInputDataArray = [
            {
                "emailAddress": "", "password": "demo", "firstName": "demo", "lastName": "demo"
            },
            {
                "emailAddress": "demo@demo.com", "password": "", "firstName": "demo", "lastName": "demo"
            },
            {
                "emailAddress": "demo@demo.com", "password": "demo", "firstName": "", "lastName": "demo"
            },
            {
                "emailAddress": "demo@demo.com", "password": "demo", "firstName": "demo", "lastName": ""
            },
            {
                "emailAddress": "", "password": "", "firstName": "", "lastName": ""
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