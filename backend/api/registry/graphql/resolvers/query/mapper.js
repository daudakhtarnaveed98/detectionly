"use strict";

// Require modules.
const login = require("./login");

// Resolvers map.
const queryResolversMap = {
    loginUser: async (args) => {
        const {userLoginData: userLoginData} = args;
        try {
            return await login.loginUser(userLoginData);
        } catch (error) {
            console.error(error);
        }
    }
};

// Export.
exports.queryResolversMap = queryResolversMap;