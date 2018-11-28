const User = require('../schemas/UserSchema');
const Thread = require('../schemas/ThreadSchema');
const ApiErrors = require('../errorMessages/apiErrors');

class ThreadRepository {

    /**
     * Gets all the threads that belong to a single user.
     * @param {*} username The username of the user.
     * @param {*} res The http response that is used to return status codes and json.
     */
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
                res.status(200).json({ "threads": threadIds })
            })
            .catch((error) => {
                res.status(error.code).json(error);
            })
    }

    /**
     * Creates (Http POST) a new thread and automatically assings the thread to the user who created it.
     * @param {*} title Thread title
     * @param {*} content Thread body
     * @param {*} username The username of the user that created the thread.
     * @param {*} res The http response that is used to return status codes and json.
     */
    static createThread(title, content, username, res) {
        const newThread = new Thread({
            title,
            content
        });

        User.findOne({ username })
            .then((user) => {
                user.threads.push(newThread);
                Promise.all([user.save(), newThread.save()])
                    .then(() => {
                        res.status(201).json({ "message": "Thread created and save to the user" })
                    })
                    .catch((error) => {
                        console.log("In catch promise.all = " + error);
                        res.status(error.code).json(error);
                    })
            })
            .catch((error) => {
                console.log("In catch findOne for user === " + error);
                res.status(error.code).json(error);
            })
    }

    static deleteThread(threadId, username) {

    }
}

module.exports = ThreadRepository;