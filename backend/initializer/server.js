"use strict";

// Require modules.
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const api = require("../api");
const database = require("./database");
const middleware = require("../middleware");

// Function to initialize server.
function initializeServer(serverPort) {
  // Initialize express.
  const detectionly = express();

  // Cross origin resource sharing configuration.
  const corsConfig = {
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  // Use middleware.
  detectionly.use(cors(corsConfig));
  detectionly.use(middleware.authenticateRequest);
  detectionly.use(bodyParser.json());
  detectionly.use(
    "/api/v1/registry/",
    graphqlHttp({
      schema: api.registry.graphql.schemas.graphqlSchema,
      rootValue: api.registry.graphql.resolvers.resolversMap,
      graphiql: true,
    })
  );

  // Setup images upload, get and delete.
  api.dataRepository.rest.uploadImages(detectionly);
  api.dataRepository.rest.deleteImagePair(detectionly);
  api.dataRepository.rest.locateImages(detectionly);
  api.dataRepository.rest.getImage(detectionly);
  api.changeDetector.rest.detectChange(detectionly);

  // Connect with database.
  database
    .connectWithMongoDB()
    // On success.
    .then(() => {
      // Start listening.
      detectionly.listen(serverPort);
      console.log("Server started listening on port:" + serverPort);
    })
    // On error.
    .catch((error) => {
      console.error(error);
    });
}

// Export.
exports.initializeServer = initializeServer;
