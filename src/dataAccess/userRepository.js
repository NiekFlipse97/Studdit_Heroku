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
                            console.log('User: ' + newUser + ' has been created. Token: ' + token);
                            response.status(200).json({token});
                        })
                        .catch(() => {
                            console.log('User: ' + newUser + ' has not successfully been created');
                            response.status(500).json(ApiErrors.internalServerError());
                        })
                } else {
                    response.status(420).json(ApiErrors.userExists());
                }
            })
            .catch(() => {
                response.status(500).json(ApiErrors.internalServerError());
            });
    };

    static login(username, password, response) {
        User.findOne({username})
            .then((user) => {
                if(user.password === password){
                    let token = auth.encodeToken(username);
                    response.status(200).json({token});
                } else {
                    response.status(401).json(ApiErrors.notAuthorised());
                }
            })
            .catch(() => {
                response.status(401).json(ApiErrors.notAuthorised())
            });

    };

    static changePassword(username, password, newPassword, response) {
        User.findOne({username})
            .then((user) => {
                console.log("User: " + user);
                if(user.password === password){
                    user.set({password: newPassword});
                    user.save()
                        .then(() => {
                            response.status(200).json({message: "your password has been changed."});
                        })
                        .catch(() => {
                            response.status(500).json(ApiErrors.internalServerError());
                        })

                } else {
                    response.status(401).json(ApiErrors.notAuthorised());
                }
            })
            .catch(() => {
                response.status(404).json(ApiErrors.notFound(username));
            });
    };

    static deleteUser(username, response){
        User.findOneAndDelete({username})
            .then(() => {
                response.status(200).json({message: "the user has been deleted."});
            })
            .catch(() => {
                response.status(500).json(ApiErrors.internalServerError());
            });
    };
};
