const express = require('express');
const router = express.Router();
const Group = require('../models/groupsListDB');


const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (err) {
        res.json({ message: err });
    }
}

const createGroup = async (req, res) => {
    const group = new Group({
        nameGroup: req.body.nameGroup,
        Members: req.body.Members
    });
    try {
        const savedGroup = await group.save();
        res.json(savedGroup);
    } catch (err) {
        res.json({ message: err });
    }
}

const findGroupByName = async (req, res) => {
    try {
        const group = await Group.find({ nameGroup: req.params.groupName });
        res.json(group);
    } catch (err) {
        res.json({ message: err });
    }
}

const deleteGroup = async (req, res) => {
    try {
        const removedGroup = await Group.remove({ nameGroup: req.params.groupName });
        res.json(removedGroup);
    } catch (err) {
        res.json({ message: err });
    }
}

module.exports = { getAllGroups, createGroup, findGroupByName, deleteGroup };


