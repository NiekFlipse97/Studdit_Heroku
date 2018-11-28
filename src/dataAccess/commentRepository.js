const User = require('../schemas/UserSchema');
const Comment = require('../schemas/CommentSchema');
const ApiErrors = require('../errorMessages/apiErrors');

class CommentRepository {
    static createComment(threadId, username, content, res){
        //TODO: find comment in database. If it doesn't exist create new comment, if it does return error message.
    };

    static deleteComment(){
        //TODO: delete comment based on unique identifier.
    }
}

module.exports = CommentRepository;