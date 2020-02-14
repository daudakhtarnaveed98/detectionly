'use strict';

// Utility functions.
// Function to concatenate schemas.
function concatenateSchemas(...schemasToCombine) {
    // Variable to hold concatenated schemas.
    let concatenatedSchemas = '';

    // Loop and concatenate.
    for (const schema of schemasToCombine) {
        concatenatedSchemas = schema + concatenatedSchemas;
    }

    // Return concatenated schema.
    return concatenatedSchemas;
}

// Export functions.
exports.concatenateSchemas = concatenateSchemas;