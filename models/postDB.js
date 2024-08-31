const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type:String ,
        required: true,
    },
    fromUser: {
        type: String,
        required: true,
    },
    toUser: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
