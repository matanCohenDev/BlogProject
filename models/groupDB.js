const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    nameGroup: {
        type: String,
        required: true,
    },
    MessageFrom:{
        type: String,
        required: true,
    },
    MessageContent:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('GroupChat', groupSchema);

