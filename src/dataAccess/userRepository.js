const auth = require('../authentication/authentication');
const User = require('../schemas/UserSchema');
const ApiErrors = require('../errorMessages/apiErrors');

module.exports = class UserRepository {
    static createUser(username, email, password, response) {
        User.findOne({username})
            .then((user) => {
                if (user === null) {
                    const newUser = new User({ username: username, email: email, password: password });
                    newUser.save()
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
                }
            })
            .catch(() => {
                response.status(409).json(ApiErrors.conflict("database conflict"));
            });
    };

    static login(username, password, response) {
        User.findOne({username})
            .then((user) => {
                if(user.password === password){
                    let token = auth.encodeToken(username);
                    response.status(200).json({token});
                } else {
                    response.status(409).json(ApiErrors.conflict("Wrong password."));
                }
            })
            .catch(() => {
                response.status(409).json(ApiErrors.conflict("The user could not been found in the database."));
            });

    };


    static changePassword() {

    };
};
