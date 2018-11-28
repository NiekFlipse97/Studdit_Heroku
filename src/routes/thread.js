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
    ThreadRepository.getAllThreadsForSingleUser(req.user.username, res);
});

/**
 * Create a new thread, and add the reference to the user threads array
 */
router.post('/', (req, res) => {
    const title = req.body.title || '';
    const content = req.body.content || '';

    ThreadRepository.createThread(title, content, req.user.username, res);
});

/**
 * Delete a single thread by it's id.
 */
router.delete('/:id', (req, res) => {
    const token = req.header('X-Access-Token');

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            const error = apiErrors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const threadId = req.params.id;
            const username = payload.sub

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