const auth = require('../authentication/authentication');
const User = require('../schemas/UserSchema');


module.exports = class repository {
    static createUser(username, email, password, callback) {
        const user = new User({username: username, email: email, password: password});

        repository.findUser(username, (exist, notExist) => {
            if (notExist) {
                user.save()
                    .then(() => {
                        console.log('User: ' + user + ' has been created');
                        callback(null, {token: auth.encodeToken(username)});
                    })
                    .catch(() => {
                        console.log('User: ' + user + ' has not successfully been created');
                        callback({message: 'The user has not successfully been created'}, null);
                    })
            } else {
                callback({message: 'The user already exists in the database'}, null)
            }
        });



    };

    static findUser(username, callback) {
        User.findOne({username: username})
            .then((user) => {
                console.log('the user ' + user.username + ' has been found in the database as: ' + user);
                callback(user, null);
            })
            .catch(() =>{
                console.log('the user ' + username + ' has not been found in the database');
                callback(null, {message: 'The user has not been found in the database'});
            });
    };
};
