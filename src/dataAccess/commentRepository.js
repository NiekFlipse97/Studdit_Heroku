const User = require('../schemas/UserSchema');
const Comment = require('../schemas/CommentSchema');
const Thread = require('../schemas/ThreadSchema');
const ApiErrors = require('../errorMessages/apiErrors');

class CommentRepository {
    static createComment(threadId, username, content, res){
        User.findOne({username})
            .then((user)=>{
                Thread.findOne({_id: threadId})
                    .then((thread)=>{
                        const newComment = new Comment({content, user});
                        thread.comments.push(newComment);

                        Promise.all([user.save(), thread.save(), newComment.save()])
                            .then(() => {
                                res.status(200).json({ message: "comment created and saved to the thread and user" })
                            })
                            .catch((error) => {
                                console.log("In catch promise.all = " + error);
                                res.status(error.code).json(error);
                            })

                    })
                    .catch(()=>{
                        res.status(500).json(ApiErrors.notFound());
                    });
            })
            .catch(()=>{
                res.status(500).json(ApiErrors.internalServerError());
            })
    };

    static deleteComment(threadId, commentId, res){
        Comment.findOneAndDelete({_id: commentId})
            .then(()=>{
                Thread.findOneAndUpdate({_id: threadId},{ $pull: { "comments": commentId }})
                    .then(()=> {
                        console.log("the comment has been deleted")
                        res.status(200).json({ message: "comment has been deleted" })
                    })
                    .catch(()=> res.status(500).json(ApiErrors.internalServerError()));
            })
            .catch(()=>{
                res.status(500).json(ApiErrors.internalServerError());
            });
        // Thread.findOneAndUpdate({_id: threadId}, { $pull: { "comments": commentId } })
        //     .then((thread) => {
        //         Comment.findOneAndDelete({_id: commentId})
        //             .then(() => {
        //                 res.status(200).json({ "message": "comment has been deleted" });
        //             })
        //             .catch(()=>{
        //                 res.status(500).json(ApiErrors.notFound());
        //             });
        //     })
        //     .catch(() => {
        //         res.status(500).json(ApiErrors.notFound());
        //     })
    }
}

module.exports = CommentRepository;
