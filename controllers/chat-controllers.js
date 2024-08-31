const express = require('express');
const router = express.Router();
const Post = require('../models/postDB');

const AddMessage = async (req, res) => {
    const { content, fromUser, toUser } = req.body;

    try {
        const newPost = new Post({ content, fromUser, toUser });
        await newPost.save();
        res.status(201).json({ msg: 'Post created successfully' });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const GetMessages = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


module.exports = { AddMessage, GetMessages };