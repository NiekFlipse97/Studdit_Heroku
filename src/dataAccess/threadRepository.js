const User = require('../schemas/UserSchema');
const Thread = require('../schemas/ThreadSchema');
const ApiErrors = require('../errorMessages/apiErrors');

class ThreadRepository {

    static getAllThreadsForSingleUser(username, res) {
        User.findOne({ username })
            .then((user) => {
                if (user) {
                    return user.threads
                    // res.status(200).json({"threads": user.threads});
                } else {
                    res.status(404).json(apiErrors.notFound());
                }
            })
            .then((threadIds) => {
                // for(let threadId of threadIds) {

                // }
                res.status(200).json({"threads": threadIds})
            })
            .catch((error) => {
                res.status(error.code).json(error);
            })
    }

}

module.exports = ThreadRepository;