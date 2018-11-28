const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the CommentSchema.
// Users can react to a comment with a comment.
// This is the reaction array.
const CommentSchema = new Schema({
    content: String,
    // reaction: [CommentSchema],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

// Create the comment collection with the CommentSchema.
const Comment = mongoose.model('comment', CommentSchema);

// Make the Comment available for other files.
module.exports = Comment;