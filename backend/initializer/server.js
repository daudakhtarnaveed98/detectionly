"use strict";

// Require modules.
const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const schemas = require("../schemas");
const resolvers = require("../resolvers");
const database = require("./database");

// Function to initialize server.
function initializeServer(serverPort) {
    // Initialize express.
    const detectionly = express();

    // Use middleware.
    detectionly.use(bodyParser.json());
    detectionly.use("/api/v1", graphqlHttp({
        schema: schemas.graphqlSchema,
        rootValue: resolvers.resolversMap,
        graphiql: true,
    }));

    // Connect with database.
    database.connectWithMongoDB()
        // On success.
        .then(
            () => {
                // Start listening.
                detectionly.listen(serverPort);
            })
        // On error.
        .catch(
            (error) => {
                console.error(error);
            });
}

// Export.
exports.initializeServer = initializeServer;