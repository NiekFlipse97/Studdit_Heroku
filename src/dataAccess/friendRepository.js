const User = require('../models/user')
const ApiErrors = require('../errorMessages/apiErrors');
const neo4j = require('neo4j-driver').v1;

//neo4j connection
const driver = neo4j.driver(('bolt://localhost/', neo4j.auth.basic(user, password));
const session = driver.session();



