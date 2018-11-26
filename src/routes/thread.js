const express = require("express");
const router = express.Router();
const auth = require('../authentication/authentication');
const apiErrors = require("../errorMessages/apiErrors.js");
const Thread = require('../schemas/ThreadSchema');
const User = require('../schemas/UserSchema');
const Isemail = require('isemail');
const repo = require('../dataAccess/repository');

/**
 * Get all the threads that the current logged in user has
 */
// router.get('/', (req, res) => {
//     const token = req.header('Authorization');

//     auth.decodeToken(token, (err, payload) => {
//         if (err) {
//             let error = apiErrors.noValidToken();
//             res.status(error.code).json(error);
//         } else {
//             const email = payload.sub;

//         }
//     })
// });

router.post('/', (req, res) => {
    const token = req.header('X-Access-Token');

    // TODO: token is now validated two times......
    auth.decodeToken(token, (err, payload) => {
        if(err) {
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

            newThread.save()
                .then(() => Thread.findOne({title, content}))
                .then((thread) => {
                    console.log('thread has been created. time to find the user.');

                    User.findOneAndUpdate({username}, {$push: {"threads": thread._id}})
                        .then(() => {
                            console.log("threads pushed");
                        })
                        .catch((error) => {
                            console.log(error)
                        })

                    res.status(201).json(thread);
                })
                .catch((error) => {
                    res.status(error.code).json(error);
                })
        }
    })
});

router.delete('/', (req, res) => {
    const token = req.header('X-Access-Token');

    auth.decodeToken(token, (err, payload) => {
        if(err) {
            const error = apiErrors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const threadId = req.body.id;
            const username = payload.sub

            console.log('the thread id that i just got: ' + threadId);

            Thread.findOne({_id: threadId})
                .then((thread) => {
                    thread.remove()
                        .then(() => {
                            User.findOneAndUpdate({username}, {$pull: {"threads": threadId}})
                                .then(() => {
                                    console.log('threads removed from user.')
                                })
                                .catch((error) => {
                                    res.status(error.code).json(error);
                                })
                        })
                    res.status(200).json({message: "thread removed"});
                })
                .catch((error) => {
                    console.log(error);
                    res.status(error.code).json(error);
                })
        }
    })
 })

module.exports = router;