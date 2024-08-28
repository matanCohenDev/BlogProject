const express = require('express');
const router = express.Router();
const Group = require('../models/groupDB');

const AddMessage = async (req, res) => {
    try {
        const { nameGroup, MessageFrom, MessageContent} = req.body;
        const newGroup = new Group({ nameGroup, MessageFrom, MessageContent});
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (err) {
        console.error('Error adding group:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}

const GetMessages = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (err) {
        console.error('Error fetching groups:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}

module.exports = { AddMessage, GetMessages };