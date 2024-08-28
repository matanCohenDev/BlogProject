const express = require('express');
const router = express.Router();
const Group = require('../models/groupsListDB');
const { getAllGroups, createGroup, findGroupByName, deleteGroup } = require('../controllers/groupsList');

router.get('/GetgroupsList', getAllGroups);

router.post('/groupsList', createGroup);

router.get('/groupsList/:groupName', findGroupByName);

router.delete('/groupsList/:groupName', deleteGroup);

module.exports = router;

