const express = require("express");
const router = express.Router();
const auth = require('../authentication/authentication');
const apiErrors = require("../errorMessages/apiErrors.js");

router.all(new RegExp("^(?!\/login$|\/register$).*"), (request, response, next) => {
    console.log("Validate Token");

    // Get the token from the request header.
    const token = request.header('X-Access-Token');

    auth.decodeToken(token, (error, payload) => {
        if (error) {
            // Print the error message to the console.
            console.log('Error handler: ' + error.message);

            // Set the response's status to error.status or 401 (Unauthorised).
            // Return json to the response with an error message.
            response.status((error.status || 401)).json(apiErrors.notAuthorised)
        } else {
            next();
        }
    });
});

module.exports = router;