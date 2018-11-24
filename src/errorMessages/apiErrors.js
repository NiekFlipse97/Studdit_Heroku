const apiError = require("./apiError.js");

module.exports = class apiErrors {
    static get notAuthorised(){
        return new apiError("Niet geautoriseerd (geen valid token)", 401);
    }

    static get wrongRequestBodyProperties(){
        return new apiError("Een of meer properties in de request body ontbreken of zijn foutief", 412);
    }

    static notFound(objectName){
        return new apiError(`Niet gevonden (${objectName} bestaat niet)`, 404);
    }

    static conflict(message){
        return new apiError(`Conflict (${message})`, 409);
    }

    static other(message, code = 500){
        return new apiError(message, code);
    }
}