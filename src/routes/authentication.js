const express = require("express");
const router = express.Router();
const auth = require('../authentication/authentication');
const apiErrors = require("../errorMessages/apiErrors.js");
const Isemail = require('isemail');

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
    })
});

router.route("/register").post((request, response) => {
    const registration = request.body;
    if(!CheckObjects.isValidRegistration(registration)){
        const error = apiErrors.wrongRequestBodyProperties;
        response.status(error.code).json(error);
        return;
    }

    // Get the users information to store in the database.
    const firstName = registration.firstname;
    const lastName = registration.lastname;
    const email = registration.email;
    const password = registration.password;

    response.status(200).json({"TEST: ": "The register check works"})
});

router.route("/login").post((request, response) => {
    const loginObject = request.body;
    if(!CheckObjects.isValidLogin(loginObject)){
        const error = apiErrors.wrongRequestBodyProperties;
        response.status(error.code).json(error);
        return;
    }
    // Get the username and password from the request.
    const email = loginObject.email;
    const password = loginObject.password;

    response.status(200).json({"TEST: ": "The login check works"})

    // Check in database for matching username and password.
    // login(email, password, (error, result) => {
    //     if(error) response.status(error.code || 500).json(error);
    //     else response.status(200).json(result);
    // });
});

function login(email, password, callback){
    // Check in database for matching username and password.
    // db.query(`SELECT * FROM user WHERE Email = "${email}" AND Password = "${password}"`, (error, rows, fields) => {
    //     if(error) console.log(`Error on login query: ${error.message}, ${error.sqlMessage}`);
    //     if(error) callback(error, null);
    //     else if(rows.length == 0) callback(apiErrors.wrongRequestBodyProperties, null);
    //     else callback(null, {
    //             token: auth.encodeToken(email),
    //             email: email
    //         });
    // });
}

class CheckObjects {
    // Returns true if the given object is a valid login
    static isValidLogin(object){
        const tmp =
            object && typeof object == "object" &&
            object.email && typeof object.email == "string" &&
            object.password && typeof object.password == "string";
        console.log(`Is login valid: ${tmp == undefined ? false : tmp}`);
        return tmp == undefined ? false : tmp;
    }

    // Returns true if the given object is a valid register
    static isValidRegistration(object){
        const tmp =
            object && typeof object == "object" &&
            object.firstname && typeof object.firstname == "string" && object.firstname.length >= 2 &&
            object.lastname && typeof object.lastname == "string" && object.lastname.length >= 2 &&
            object.email && typeof object.email == "string" && Isemail.validate(object.email) &&
            object.password && typeof object.password == "string";
        console.log(`Is registration valid: ${tmp == undefined ? false : tmp}`);
        return tmp == undefined ? false : tmp;
    }
}

module.exports = router;