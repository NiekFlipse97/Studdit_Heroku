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
     * Get all the thread with the corresponding username, upvotes and downvotes.
     * @param {*} res The http response that is used to return status codes and json.
     */
    static getAllThreads(res) {
        let responseObject = [];

        User.find({})
            .populate('threads')
            .then((users) => {
                for (let user of users) {
                    if (user.threads) {
                        for (let thread of user.threads) {
                            responseObject.push({
                                "_id": thread._id,
                                "title": thread.title,
                                "content": thread.content,
                                "upvotes": thread.upvotes,
                                "downvotes": thread.downvotes,
                                "username": user.username
                            });
                        }
                    }
                }
                res.status(200).json({ "threads": responseObject });
            })
            .catch((error) => {
                console.log(error);
                res.status(error.code).json(error);
            })
    }

    static getSingleThreadWithComments(threadId, res) {
        User.find({})
            .populate({
                path: 'threads',
                populate: {
                    path: 'comments',
                    model: 'comment'
                }
            })
            .then((users) => {
                for (let user of users) {
                    if (user.threads) {
                        for (let thread of user.threads) {
                            if (thread._id == threadId) {
                                res.status(200).json({
                                    "thread": thread,
                                    "username": user.username
                                });
                            }
                        }
                    } else {
                        res.status(404).json(ApiErrors.notFound());
                    }
                }
            })
            .catch((error) => {
                console.log("error van de get single thread with comments ==== " + error);
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
            content,
            upvotes: 0,
            downvotes: 0
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

    /**
     * Delete a single thread by it's id
     * @param {*} threadId The id of the thread that will be deleted.
     * @param {*} username The username of the user that deletes the thread.
     */
    static deleteThread(threadId, username, res) {
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

    static updateThread(threadId, newContent, res) {
        Thread.findOne({ _id: threadId })
            .then((thread) => {
                thread.content = newContent;
                thread.save()
                    .then(() => {
                        res.status(200).json({ "message": "The thread is updated." })
                    })
                    .catch((error) => {
                        console.log('Oops something went wrong wile saving the updated thread: ' + error)
                        res.status(error.code).json(error);
                    });
            })
            .catch((error) => {
                console.log("Oops something went wrong while finding the thread.");
                res.status(error.code).json(error);
            })
    }

    static upvote(threadId, username, res) {
        User.findOne({ username })
            .then((user) => {
                let isUpvoted = false;
                let isDownvoted = false;
                for (let vote of user.upvoted) {
                    if (vote == threadId) {
                        isUpvoted = true;
                    }
                }

                for (let vote of user.downvoted) {
                    if (vote == threadId) {
                        isDownvoted = true;
                    }
                }

                if (isDownvoted) {
                    Thread.update({ _id: threadId }, { $inc: { downvotes: -1 } })
                        .then(() => Thread.findOne({ _id: threadId }))
                        .then((thread) => {
                            if (thread) {
                                var index = user.downvoted.indexOf(threadId);
                                if (index >= 0) {
                                    user.downvoted.splice(index, 1);
                                }
                            } else {
                                console.log('Thread is null or undefined')
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(error.code).json(error);
                        })
                }

                if (!isUpvoted) {
                    Thread.update({ _id: threadId }, { $inc: { upvotes: 1 } })
                        .then(() => Thread.findOne({ _id: threadId }))
                        .then((thread) => {
                            if (thread) {
                                user.upvoted.push(threadId)

                                return user.save()
                            } else {
                                res.status(404).json(ApiErrors.notFound())
                            }
                        })
                        .then(() => {
                            res.status(200).json({ "message": "Thread has been upvoted" })
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(error.code).json(error);
                        })
                } else {
                    res.status(403).json({ "message": "You already upvoted this thread" });
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(error.code).json(error);
            })
    }

    static downvote(threadId, username, res) {
        User.findOne({ username })
            .then((user) => {
                let isDownvoted = false;
                let isUpvoted = false;
                for (let vote of user.downvoted) {
                    if (vote == threadId) {
                        isDownvoted = true;
                    }
                }

                for (let vote of user.upvoted) {
                    if (vote == threadId) {
                        isUpvoted = true;
                    }
                }

                if (isUpvoted) {
                    Thread.update({ _id: threadId }, { $inc: { upvotes: -1 } })
                        .then(() => Thread.findOne({ _id: threadId }))
                        .then((thread) => {
                            if (thread) {
                                var index = user.upvoted.indexOf(threadId);
                                if (index >= 0) {
                                    user.upvoted.splice(index, 1);
                                }
                            } else {
                                console.log('Thread is null or undefined')
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(error.code).json(error);
                        })
                }

                if (!isDownvoted) {
                    Thread.update({ _id: threadId }, { $inc: { downvotes: 1 } })
                        .then(() => Thread.findOne({ _id: threadId }))
                        .then((thread) => {
                            if (thread) {
                                user.downvoted.push(threadId)

                                return user.save()
                            } else {
                                res.status(404).json(ApiErrors.notFound())
                            }
                        })
                        .then(() => {
                            res.status(200).json({ "message": "Thread has been downvoted" })
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(error.code).json(error);
                        })
                } else {
                    res.status(403).json({ "message": "You already downvoted this thread" });
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(error.code).json(error);
            })
    }
}

module.exports = ThreadRepository;