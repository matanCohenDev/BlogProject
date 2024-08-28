const mongoose = require('mongoose');

const groupListSchema = new mongoose.Schema({
    nameGroup: {
        type: String,
        required: true,
    },
    Members: {
        type: Array,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('GroupList', groupListSchema);