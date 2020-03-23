"use strict";

// Require modules.
const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const api = require("../api");
const database = require("./database");

// Function to initialize server.
function initializeServer(serverPort) {
    // Initialize express.
    const detectionly = express();

    // Use middleware.
    detectionly.use(bodyParser.json());
    detectionly.use("/api/v1/registry/", graphqlHttp({
        schema: api.registry.graphql.schemas.graphqlSchema,
        rootValue: api.registry.graphql.resolvers.resolversMap,
        graphiql: true,
    }));

    // Setup images upload and delete.
    api.dataRepository.rest.uploadImages(detectionly);
    api.dataRepository.rest.deleteImage(detectionly);

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