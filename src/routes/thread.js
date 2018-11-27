const express = require("express");
const router = express.Router();
const auth = require('../authentication/authentication');
const apiErrors = require("../errorMessages/apiErrors.js");
const ThreadRepository = require('../dataAccess/threadRepository');
const User = require('../schemas/UserSchema');
const Thread = require('../schemas/ThreadSchema');

/**
 * Get all the threads that the current logged in user has
 */
router.get('/', (req, res) => {
    const token = req.header('X-Access-Token');

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            let error = apiErrors.noValidToken();
            res.status(error.code).json(error);
        } else {
            ThreadRepository.getAllThreadsForSingleUser(payload.sub, res);
        }
    })
});

/**
 * Create a new thread, and add the reference to the user threads array
 */
router.post('/', (req, res) => {
    const token = req.header('X-Access-Token');

    // TODO: token is now validated two times......
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            const error = apiErrors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const username = payload.sub
            const title = req.body.title || '';
            const content = req.body.content || '';

            const newThread = new Thread({
                title,
                content
            });

            User.findOne({username})
                .then((user) => {
                    user.threads.push(newThread);
                    Promise.all([user.save(), newThread.save()])
                        .then(() => {
                            console.log("Als het goed is is alles opgeslagen")
                            res.status(201).json({"message": "Thread created and save to the user"})
                        })
                        .catch((error) => {
                            res.status(error.code).json(error);
                        })
                })
                .catch((error) => {
                    res.status(error.code).json(error);
                })
        }
    })
});

/**
 * Delete a single thread by it's id.
 */
router.delete('/', (req, res) => {
    const token = req.header('X-Access-Token');

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            const error = apiErrors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const threadId = req.body.id;
            const username = payload.sub

            console.log('the thread id that i just got: ' + threadId);

            Thread.findOne({ _id: threadId })
                .then((thread) => {
                    if (thread) {
                        thread.remove()
                            .then(() => {
                                User.findOneAndUpdate({ username }, { $pull: { "threads": threadId } })
                                    .then(() => {
                                        console.log('threads removed from user.')
                                    })
                                    .catch((error) => {
                                        res.status(error.code).json(error);
                                    })
                            })
                        res.status(200).json({ message: "thread removed" });
                    } else {
                        res.status(404).json(apiErrors.notFound());
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(error.code).json(error);
                })
        }
    })
})

module.exports = router;