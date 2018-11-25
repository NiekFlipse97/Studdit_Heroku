const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the schema for the Thread table/collection.
const ThreadSchema = new Schema({
    title: String,
    content: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }]
});

// Define the thread collection and add the ThreadSchema.
const Thread = mongoose.model('thread', ThreadSchema);

// Make thread available for other files.
module.exports = Thread;