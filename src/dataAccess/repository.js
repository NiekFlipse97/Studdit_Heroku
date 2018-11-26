const auth = require('../authentication/authentication');
const User = require('../schemas/UserSchema');
const ApiErrors = require('../errorMessages/apiErrors');

module.exports = class repository {
    static createUser(username, email, password, response) {
        const user = new User({ username: username, email: email, password: password });

        repository.findUser(username, (exist, notExist) => {
            if (notExist) {
                user.save()
                    .then(() => {
                        let token = auth.encodeToken(username);
                        console.log('User: ' + user + ' has been created. Token: ' + token);
                        response.status(200).json({token});
                        // callback(null, { token: auth.encodeToken(username) });
                    })
                    .catch((error) => {
                        console.log('User: ' + user + ' has not successfully been created');
                        response.status(error.code || 500).json(error)
                        // callback({ message: 'The user has not successfully been created' }, null);
                    })
            } else {
                response.status(409).json(ApiErrors.conflict("The user already exists in the database."));
                // callback({ message: 'The user already exists in the database' }, null)
            }
        });
    };

    static findUser(username, callback) {
        User.findOne({ username: username })
            .then((user) => {
                console.log('the user ' + user.username + ' has been found in the database as: ' + user);
                callback(user, null);
            })
            .catch(() => {
                console.log('the user ' + username + ' has not been found in the database');
                callback(null, { message: 'The user has not been found in the database' });
            });
    };
};
