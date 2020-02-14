'use strict';

// Require modules.
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const schemas = require('./schemas');

// Initialize objects.
const registry = express();

// Initialize middleware.
registry.use(bodyParser.json());
registry.use('/api/registry', graphqlHttp(
    {
        schema: schemas.graphqlSchema,
        graphiql: true
    }
));

// Start listening.
registry.listen(3000);